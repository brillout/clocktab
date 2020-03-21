import './css/clock.css';
import ClockView from './ClockView';
import onPageLoad from './onPageLoad';

export default {
  route: '/',
  view: ClockView,

  title: 'Clock Tab',

  onPageLoad,

  renderToDom: true,
  renderToHtml: true,
};

