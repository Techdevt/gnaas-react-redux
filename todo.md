change theme and homepage header
images /use amazon s3 if possible
markdown editor attaching image also
getposts queryposts
blog posting according to type eg. alumni, general, congress, campuses, evangelism
bulk email using markdown
push notifications
sabbath school discussion
patrons page
email template change

1. Add images - upload images into temp directory - when post isn't saved, remove images - when we navigate from page without saving - when we close tab (asynchronous action without any result).
2. Select images added to add to the image reference 

# Instance ID
i-008f35d8
# Public DNS
ec2-52-37-186-239.us-west-2.compute.amazonaws.com
# Instance state
running
# Public IP
	52.37.186.239
# Private DNS
ip-172-31-34-37.us-west-2.compute.internal
# Private IPs
172.31.34.37

HAProxy for cluster wide loadbalancing, including balancing several instances of a process per machine
CDN for static content (e.g. Cloudinary)
pm2 for process load balancing

npm install --only-dev
npm install --production
npm prune --production
free -m //free memory
df -h //free space
sudo dd if=/dev/zero of=/swapfile bs=1G count=4
ls -lh /swapfile

sudo fallocate -l 4G /swapfile

<Helmet
    title="My Title"
    titleTemplate="MySite.com - %s"
    base={{"target": "_blank", "href": "http://mysite.com/"}}
    meta={[
        {"name": "description", "content": "Helmet application"},
        {"property": "og:type", "content": "article"}
    ]}
    link={[
        {"rel": "canonical", "href": "http://mysite.com/example"},
        {"rel": "apple-touch-icon", "href": "http://mysite.com/img/apple-touch-icon-57x57.png"},
        {"rel": "apple-touch-icon", "sizes": "72x72", "href": "http://mysite.com/img/apple-touch-icon-72x72.png"}
    ]}
    script={[
      {"src": "http://include.com/pathtojs.js", "type": "text/javascript"}
    ]}
    onChangeClientState={(newState) => console.log(newState)}
/>


#deps
async@1.5.2 axios@0.9.0 babel@6.3.13 babel-core@6.3.21 babel-loader@6.2.0 babel-plugin-react-transform@2.0.0-beta1 
babel-plugin-transform-class-properties@6.3.13 babel-plugin-transform-decorators-legacy@1.3.4 
babel-plugin-transform-object-rest-spread@6.3.13 babel-preset-es2015@6.3.13 babel-preset-react@6.3.13 
bcrypt@0.8.5 body-parser@1.14.2 compression@1.6.1 connect-mongo@1.1.0 css-loader@0.23.1 emailjs@1.0.1 express@4.13.3 
express-session@1.13.0 extract-text-webpack-plugin@1.0.1 file-loader@0.8.5 getmdl-select@1.0.0 history@1.17.0 
http-proxy@1.13.2 http-status@0.2.0 immutable@3.7.5 jade@1.11.0 jsonwebtoken@5.5.0 lodash@4.3.0
material-design-lite@1.0.6 mkdirp@0.5.1 mongoose@4.3.3 mongoose-autopopulate@0.4.0 morgan@1.6.1
multer@1.1.0 node-sass@3.4.2 object-assign@4.0.1 path@0.12.7 postcss-loader@0.8.0 pretty-error@2.0.0 
promise-defer@1.0.0 react@0.15.0-alpha.1 react-addons-css-transition-group@0.14.7 
react-addons-transition-group@0.14.7 react-dom@0.14.7 react-helmet@2.3.1 react-input-autosize@0.6.8 react-mdl@1.4.2 react-mixin@3.0.3
react-modal@0.6.1 react-multistep@2.0.3 react-notification@4.0.0 react-portal@2.0.0 react-redux@4.2.0 react-router@2.0.0 
react-router-redux@3.0.0 redux@3.3.1 redux-async-connect@0.1.13 redux-thunk@1.0.3 sass-loader@3.1.2 scroll-behavior@0.3.2
serialize-javascript@1.1.2 serve-favicon@2.3.0 socket.io@1.3.7 style-loader@0.13.0 superagent@1.7.2 tween.js@16.3.4 
url-loader@0.5.7 uuid@2.0.1 webpack@1.12.14 webpack-dev-middleware@1.4.0 webpack-hot-middleware@2.6.0

material-design-icons@2.1.3 lwip@0.0.8

#devDeps
autoprefixer-loader@3.2.0 babel-eslint@5.0.0-beta6 chai@3.4.1 chai-immutable@1.5.3 css-loader@0.23.1 
eslint@1.10.3 eslint-plugin-react@3.12.0 extract-text-webpack-plugin@1.0.1 file-loader@0.8.5 mocha@2.3.4
react-transform-hmr@1.0.1 style-loader@0.13.0 superagent@1.6.1 url-loader@0.5.7 webpack-dev-middleware@1.4.0 webpack-hot-middleware@2.6.0