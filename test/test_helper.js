process.env.NODE_ENV = 'test';
require('../src/helpers/connectDatabase');
const { Story } = require('../src/models/story.model');

beforeEach('Remove database for test', async () => {
    await Story.remove({});
});
