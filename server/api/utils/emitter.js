import {EventEmitter} from 'events';

const workflow = new EventEmitter();

workflow.outcome = {
	success: false,
	errors: [],
	errFor: {} 
};

workflow.hasErrors = () => {
	
};

workflow.on('exception', (err) => {
	workflow.outcome.errors.push('Exception: ' + err);
	workflow.emit('response');
});

workflow.on('response', () => {

});

export default workflow;



//   workflow.on('patchAccount', function(token, hash) {
//     var fieldsToSet = { verificationToken: hash };
//     req.app.db.models.Account.findByIdAndUpdate(req.user.roles.account.id, fieldsToSet, function(err, account) {
//       if (err) {
//         return workflow.emit('exception', err);
//       }

//       sendVerificationEmail(req, res, {
//         email: workflow.user.email,
//         verificationToken: token,
//         onSuccess: function() {
//           workflow.emit('response');
//         },
//         onError: function(err) {
//           workflow.outcome.errors.push('Error Sending: '+ err);
//           workflow.emit('response');
//         }
//       });
//     });
//   });

//   workflow.emit('validate');
// };


