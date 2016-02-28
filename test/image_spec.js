import expect from 'chai';
import ImageUtils from '../server/api/utils/image';

describe('Images', function() {
	const ImageHandler = new ImageUtils();

	it('opens images', (done) => {
		const image = 'test/avatar.jpg';
		ImageHandler.open(image);
	});
});