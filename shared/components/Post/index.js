import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { IconButton, Button } from 'react-mdl';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { createPost, resetMessages } from 'actions/PostActions';
import { slugify } from 'lib/util';
import ActionResult from 'components/ActionResult';
import Notification from 'react-notification';

@connect(state => ({ postSuccess: state.posts.get('postSuccess'), message: state.posts.get('message') }))
export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            files: [],
            attached: [],
            rows: Math.ceil((window.innerHeight - 99) / 26),
            title: '',
            abstract: '',
            validation: {
                isValid: true,
                validationMessage: ''
            }
        };
    }

    contentChanged = (evt) => {
        this.setState({
            content: evt.target.value
        });
    };

    goToUrl = (path, evt) => {
        const { history, location } = this.props;

        if (path === location.pathname) return;
        if (path === '/dashboard/post/images') {
            const cursorPos = ReactDOM
                .findDOMNode(document.querySelector('.Editor__TextField'))
                .children[0]
                .selectionStart;
            return history.push(`${path}?iat=${cursorPos}`);
        }
        history.push(path);
    };

    savePost = () => {
        const { dispatch } = this.props;
        let formData = new FormData();

        this.validate().then(() => {
            Object.keys(this.state).forEach((key) => {
                if (key === 'rows') return;
                if (key === 'attached') {
                    return this.state.attached.forEach((file) => {
                        formData.append(file.name, file);
                    });
                }
                if (key === 'headerImage') {
                    formData.append('headerImage', this.state[key]);
                }
                if (key === 'title') {
                    formData.append('shorturl', JSON.stringify(slugify(this.state[key])));
                }
                formData.append(key, JSON.stringify(this.state[key]));
            });
            dispatch(createPost(formData));
        }, (err) => {
            this.setState({
                validation: {
                    isValid: false,
                    validationMessage: err
                }
            });
        });
    };

    validate = () => {
        const requiredFields = [
            'title',
            'content',
            'abstract',
        ];

        return new Promise((resolve, reject) => {
            const found = requiredFields.findIndex((entry) => {
                return this.state[entry] === '' || undefined || null;
            });

            if (found !== -1) {
                reject(`${requiredFields[found]} is required`);
            }

            resolve(true);
        });
    };

    publishPost = () => {

    };

    addHeaderImage = (index) => {
        return this.setState({
            headerImage: this.state.files[index]
        });
    };

    fieldChanged = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value
        });
    };

    addImages = (files) => {
        const filtered = files.filter((file) => {
            const found = this.state.files.findIndex((item) => {
                return item.name === file.name;
            });

            return found === -1;
        });
        this.setState({
            files: filtered
        });
    };

    removeImage = (index) => {
        //fix this
        this.setState({
            files: [...this.state.files.slice(index, 1),
                ...this.state.files.slice(index + 1)
            ]
        });
    };

    insertImage = (index, insertAt) => {
        const image = this.state.files[index];
        const str = `\n ![attachment-${index}](${image.preview} =100x80)`;

        this.setState({
            content: this.state.content.slice(0, insertAt) + str + this.state.content.slice(insertAt),
            attached: [...this.state.attached, image]
        });
    };

    clearMessage = () => {
        const { dispatch } = this.props;
        dispatch(resetMessages());
    };

    closeNotification = () => {
        this.setState({
            validation: {
                isValid: true,
                validationMessage: ''
            }
        });
    };

    getNotificationStyles = () => {
	  let bar = {
	    background: '#263238'
	  };
	  
	  let active = {
	    left: (window.innerWidth <= '740') ? '10px': '260px'
	  };

	  let action = {
	    color: '#FFCCBC'
	  };

	  return { bar, active, action };
	};

    render() {
        //add delete button
        const { message, postSuccess } = this.props;
        return ( 
        	<div className="EditorContainer"> 
	        	{
	                (message) &&
	                <ActionResult type={ (postSuccess) ? 'success' : 'failure' } onConfirm={
	                    () => {
	                        (message !== '') ? this.clearMessage(): false;
	                    }
	                } message={ message } isOpen={ true }
	                />
	            }
	            <Notification isActive={!this.state.validation.isValid }
		            message={ this.state.validation.validationMessage }
		            action="close"
		            onClick={ this.closeNotification }
		            dismissAfter={ 5000 }
		            onDismiss={this.closeNotification}
		            style={this.getNotificationStyles()}
	            /> 
	            <div className = "EditorContainer__Header"> 
	            	<Button name = "publish" onClick = { this.publishPost } raised ripple style = {{ textTransform: 'capitalize' }} > Publish </Button> 
	            	<Button onClick={ this.goToUrl.bind(this, '/dashboard/post')} raised ripple style={{ textTransform: 'capitalize' }}> Editor </Button> 
	            	<div className="EditorContainer__Header-actions"> 
	            		<IconButton name="image" onClick={this.goToUrl.bind(this, '/dashboard/post/images')}/> 
	            		<IconButton name="settings" onClick={this.goToUrl.bind(this, '/dashboard/post/settings')}/> 
	            		<IconButton name="save" onClick={this.savePost}/> 
	            	</div> 
	            </div>
            {
	            React.cloneElement(this.props.children, {
	                ...this.state,
	                contentChanged: this.contentChanged,
	                published: this.published,
	                addImages: this.addImages,
	                insertImage: this.insertImage,
	                addHeaderImage: this.addHeaderImage,
	                fieldChanged: this.fieldChanged
	            })
        	} 
        </div>
    );
}
}