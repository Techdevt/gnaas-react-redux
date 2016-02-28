import React from 'react';
import {connect} from 'react-redux';

export default function requireAuthentication(Component, predicate) {
    class AuthenticatedComponent extends React.Component {
        static reduxAsyncConnect = Component.reduxAsyncConnect;
        
        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth();
        }

        checkAuth() {
            const { history, user } = this.props;

            if(user) {
                this.type = Object.keys(user.roles)[0];
            }
            if(predicate && !this.props.user.roles[predicate]) {
                //replace history with not authorized component
                history.replace('/unauthorized');
            }else if (!this.props.isAuthenticated) {
                let redirectAfterLogin = this.props.location.pathname;
                history.replace(`/login?returnTo=${redirectAfterLogin}`);
            }
        }

        render() {
            return (
                <div style={{height: '100%'}}>
                    {this.props.isAuthenticated === true
                        ? <Component {...this.props} type={this.type}/>
                        : null
                    }
                </div>
            )

        }
    }

    const mapStateToProps = (state) => ({
        user: state.Auth.toJSON().user,
        isAuthenticated: state.Auth.get('isAuthenticated')
    });

    return connect(mapStateToProps)(AuthenticatedComponent);
}
