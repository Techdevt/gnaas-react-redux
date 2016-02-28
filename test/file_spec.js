// import FileUtils from '../server/api/utils/file';
// import { expect } from 'chai';

// describe('Files', function() {
// 	const FileHandler = new FileUtils();
// 	this.timeout(15000);

// 	it('copies files', (done) => {
// 		const sourceFile = 'test/avatar.jpg';
// 		const destFile = 'server/uploads/avatar.jpg';

// 		FileHandler.copy(sourceFile, destFile).then(function(res){
// 			expect(res).to.be.equal(true);
// 			done();
// 		}, function(err) {
// 			expect(err).to.not.exist;
// 		});
// 	});

// 	it('moves files', (done) => {
// 		const sourceFile = 'server/uploads/avatar.jpg';
// 		const destFile = 'server/uploads/new/avatar.jpg';

// 		FileHandler.move(sourceFile, destFile).then(function(res){
// 			expect(res).to.be.equal(true);
// 			done();
// 		}, function(err) {
// 			expect(err).to.not.exist;
// 		});
// 	});

// 	it('deletes files', (done) => {
// 		const delSource = 'server/uploads/new';

// 		FileHandler.deleteFolder(delSource).then(function(res) {
// 			expect(res).to.be.equal(true);
// 			done();
// 		}, function(err) {
// 			expect(err).to.not.exist;
// 		});
// 	});
// });