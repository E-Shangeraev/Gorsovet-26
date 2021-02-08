const EventEmitter = require('events');

class Logger extends EventEmitter {
  log(message) {
    this.emit('msg', `${message} ${Date.now()}`);
  }
}

const logger = new Logger();

logger.on('msg', (data) => {
  console.log(data);
});

logger.log('Hello');
