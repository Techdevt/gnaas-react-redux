'use strict';

import config from '../../../config/defaults';
import emailjs from 'emailjs/email';

export default function sendEmail(req, res, options) {
  /* options = {
    to: String,
    cc: String,
    bcc: String,
    text: String,
    textPath String,
    html: String,
    htmlPath: String,
    attachments: [String],
    success: Function,
    error: Function
  } */

  var renderText = function(callback) {
    res.render(options.textPath, options.locals, function(err, text) {
      if (err) {
        callback(err, null);
      }
      else {
        options.text = text;
        return callback(null, 'done');
      }
    });
  };

  var renderHtml = function(callback) {
    res.render(options.htmlPath, options.locals, function(err, html) {
      if (err) {
        callback(err, null);
      }
      else {
        options.html = html;
        return callback(null, 'done');
      }
    });
  };

  var renderers = [];
  if (options.textPath) {
    renderers.push(renderText);
  }

  if (options.htmlPath) {
    renderers.push(renderHtml);
  }

  require('async').parallel(
    renderers,
    function(err, results){
      if (err) {
        options.error('Email template render failed. '+ err);
        return;
      }

      var attachments = [];

      if (options.html) {
        attachments.push({ data: options.html, alternative: true });
      }

      if (options.attachments) {
        for (var i = 0 ; i < options.attachments.length ; i++) {
          attachments.push(options.attachments[i]);
        }
      }

      var emailer = emailjs.server.connect( config.smtp.credentials );
      emailer.send({
        from: options.locals.projectName,
        to: options.to,
        'reply-to': options.replyTo || config.smtp.from.address,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        attachment: attachments
      }, function(err, message) {
        if (err) {
          options.error('Verification mail failed to send. '+ err);
          return;
        }
        else {
          options.success(message);
          return;
        }
      });
    }
  );
};