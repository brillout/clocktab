import {getPageConfig} from '../PageWrapper';
import onPageLoad from './onPageLoad';
import ContactView from './ContactView';

export default getPageConfig(ContactView, 'Contact', {onPageLoad});
