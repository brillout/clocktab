import './content-view.css';

import Header from '../Header';
import Footer from '../Footer';

export default ContentView;

function ContentView({children}) {
  return <>
    <Header/>
      <div id="page-content">
        {children}
      </div>
    <Footer/>
  </>;
}

