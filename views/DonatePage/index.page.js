import {getPageConfig} from '../PageWrapper';
import onPageLoad from './onPageLoad';
import DonateView from './DonateView';

export default getPageConfig(DonateView, 'Donate', {onPageLoad, noHeader: true});
