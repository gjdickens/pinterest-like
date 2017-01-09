import React from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import { Col, Button } from 'react-bootstrap';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import PicPreview from './PicPreview';
import _ from 'lodash';


export default ({picData, loggedIn, app}) => {

  function generateLayout(data) {
    return data.map(function (item, i) {
    var y = Math.ceil(Math.random() * 2) + 1;
    var h = 4;
    if (item.imgHeight < 1) {
      h = 2.5;
    }
    return {
      x: _.random(0, 5) * 2 % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: h,
      i: i.toString()
    };
  });
}

    return <Gallery
            picData={picData}
            generateLayout={generateLayout}
            loggedIn={loggedIn}
            app={app} />;

}


class Gallery extends React.Component {
  constructor(props) {
    super(props);

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.generateDOM = this.generateDOM.bind(this);
    this.changeLayouts = this.changeLayouts.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);

    this.state = {
      currentBreakpoint: 'lg',
      mounted: false,
      layouts: {lg: this.props.generateLayout(this.props.picData)},
    };
  }

  componentDidMount() {
    this.setState({mounted: true });
  }

  changeLayouts() {
    let picData = this.props.picData;
    let layouts = JSON.parse(JSON.stringify(this.state.layouts.lg));
    let variance = picData.length - layouts.length;
    if (variance !== 0) {
      this.setState({layouts: {lg: this.props.generateLayout(this.props.picData)}});
    }
  }


  generateDOM() {
  var that = this;
  let loggedIn = this.props.loggedIn
  let app = this.props.app;
  let picData = this.props.picData;



  return picData.map(function (l, i) {

    return (
      <div key={i} className='gallery-card container-fluid'>
          <PicPreview
            key={picData[i]._id}
            picData={picData[i]}
            loggedIn={loggedIn}
            handlePicClick={app.handlePicClick}
            handleUserClick={app.handleUserClick}
            swapImage={app.swapImage} />
      </div>);
  });
}

  onBreakpointChange = (breakpoint) => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  }

  onLayoutChange() {
    this.changeLayouts();
  }


  render() {
    return (
      <div>
         <ResponsiveReactGridLayout
             {...this.props}
             layouts={this.state.layouts}
             onLayoutChange={this.onLayoutChange}
             onBreakpointChange={this.onBreakpointChange}
             measureBeforeMount={false}
             useCSSTransforms={this.state.mounted}>
           {this.generateDOM()}
         </ResponsiveReactGridLayout>
       </div>
    );
  }
  }

  Gallery.defaultProps = {
    className: "layout",
    cols: {lg: 8, md: 8, sm: 4, xs: 4, xxs: 2},
    rowHeight: 150
  };
