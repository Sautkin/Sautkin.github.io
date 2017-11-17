import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';

const dom = observable({
  style: {
    display: 'flex',
    margin: '50px auto',
    width: '80%',
    justifyContent: 'space-around',
  },
  children: [
    {
      style: {
        width: '30%',
        border: '1px solid #000',
        height: 300,
      },
      children: [],
    }, {
      style: {
        width: '30%',
        border: '1px solid #000',
        height: 300,
      },
      children: [],
    }, {
      style: {
        width: '30%',
        border: '1px solid #000',
        height: 300,
      },
      children: [],
    }
  ]
});

const glob = observable({
	currentElem: null,
});

const Designer = () => [
	<Elem elem={dom} />,
	<Frame />,
];

@observer
class Elem extends Component {
	onClick = () => console.log();

  render() {
  	const { children, ...elem } = this.props.elem;

    return (
      <div
      	{...elem}
      	onClick={e => e.target === e.currentTarget ? glob.currentElem = e.currentTarget : null}
      >
        { children ? children.map(child => (
          <Elem elem={child} />
        )) : null}
      </div>
    );
  }
};

@observer
class Frame extends Component {
	@observable activeSides = {
		top: true,
		bottom: false,
		left: false,
		right: false,
	}

	@computed get getPosition() {
		if (!glob.currentElem) { return { top: 10, left: 10, width: 100, height: 100 } };

		const { top, left, width, height } = glob.currentElem.getBoundingClientRect();

		return { top, left, width, height };
	}

	render() {
		const { activeSides, getPosition } = this;

		return (
			<div
				style={{
					position: 'fixed',
					...getPosition,
				}}
			>
				<div
					onClick={() => activeSides.top = !activeSides.top }
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: '5px',
						cursor: 'pointer',
						borderTop: '1px solid',
						borderTopColor: activeSides.top ? '#F00' : '#000',
					}}
				/>
				<div
					onClick={() => activeSides.bottom = !activeSides.bottom }
					style={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: '5px',
						cursor: 'pointer',
						borderBottom: '1px solid',
						borderBottomColor: activeSides.bottom ? '#F00' : '#000',
					}}
				/>
				<div
					onClick={() => activeSides.left = !activeSides.left }
					style={{
						position: 'absolute',
						top: 0,
						bottom: 0,
						left: 0,
						width: '5px',
						cursor: 'pointer',
						borderLeft: '1px solid',
						borderLeftColor: activeSides.left ? '#F00' : '#000',
					}}
				/>
				<div
					onClick={() => activeSides.right = !activeSides.right }
					style={{
						position: 'absolute',
						top: 0,
						bottom: 0,
						right: 0,
						width: '5px',
						cursor: 'pointer',
						borderRight: '1px solid',
						borderRightColor: activeSides.right ? '#F00' : '#000',
					}}
				/>

			</div>
		)
	}
};

ReactDOM.render(<Designer />, document.getElementById('root'));
registerServiceWorker();
