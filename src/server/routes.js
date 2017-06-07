import path from 'path';
import nextRoutes from 'next-routes';
import _ from 'lodash';
import fs from 'fs';

const pages = nextRoutes();

pages.add('createEvent', '/:collectiveSlug/events/(new|create)');
pages.add('event', '/:collectiveSlug/events/:eventSlug');
pages.add('editEvent', '/:collectiveSlug/events/:eventSlug/edit');
pages.add('events', '/:collectiveSlug/events');
pages.add('events', '/');
pages.add('button', '/:collectiveSlug/donate/button');

module.exports = (server) => {

  server.get('/:collectiveSlug/donate/button:size(|@2x).png', (req, res) => {
    const color = (req.query.color === 'blue') ? 'blue' : 'white';
    res.sendFile(path.join(__dirname, `../static/images/buttons/donate-button-${color}${req.params.size}.png`));
  });

  server.get('/:collectiveSlug/donate/button.js', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname,'../templates/widget.js'), 'utf8');
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    const compiled = _.template(content);
    res.setHeader('content-type', 'application/javascript');
    res.send(compiled({
      collectiveSlug: req.params.collectiveSlug,
      host: process.env.WEBSITE_URL || "http://localhost:3000"
    }))
  });

  return pages.getRequestHandler(server.next);

}
