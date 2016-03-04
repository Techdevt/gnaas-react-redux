change theme and homepage header
markdown editor attaching image also
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