import './style.scss';

import barba from '@barba/core';
import barbaCss from '@barba/css';

barba.use(barbaCss);
barba.init({
  transitions: [
    {
      name: 'home',
      beforeOnce(){console.log('before once')},
      once(){},
      afterOnce(){console.log('after once')}
    },
    {
      name: 'fade',
      to: {
        namespace: ['barba2']
      },
      leave(){},
      enter(){},
    }
  ]
});
