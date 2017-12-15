import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { observer } from 'mobx-react';
import { observable, computed, autorun } from 'mobx';
import Worker from './test.worker.js';

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
        height: 100,
      },
      children: [],
    }, {
      style: {
        width: '30%',
        border: '1px solid #000',
        height: 100,
      },
      children: [],
    }, {
      style: {
        width: '30%',
        border: '1px solid #000',
        height: 100,
      },
      children: [],
    }
  ]
});



console.log(44444)

const testWorker = new Worker();

const sharedBuffer = new window.SharedArrayBuffer(10 * Int32Array.BYTES_PER_ELEMENT);

testWorker.postMessage({ sharedBuffer });

const sharedArray = new Int32Array(sharedBuffer); // (B)


window.Atomics.store(sharedArray, 0, 123);


// testWorker.postMessage('Success!');

// testWorker.onmessage = function(e) {
// 	alert(e.data);
// };





// autorun(() => { dom.children[0].style.border; })

const glob = observable({
	currentElem: null,
});

const Designer = () => [
	<Elem elem={dom} />,
	<Frame />,
	<Workplace>
		<Grid />
	</Workplace>,
];

@observer
class Elem extends Component {
  onClick = e => {
  	e.target === e.currentTarget ? glob.currentElem = e.currentTarget : null;
  	if (e.target === e.currentTarget) {
  		this.props.elem.style.border = '3px solid #0f0';
  	}
  };

  render() {
  	const { children, ...elem } = this.props.elem;
  	console.log(this.props.elem, 555, elem)

    return (
      <div
      	{...elem}
      	onClick={this.onClick}
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

	@observable content = '';
	@observable pressed = false;

	@computed get getPosition() {
		if (!glob.currentElem) { return { top: 10, left: 10, width: 100, height: 100 } };

		const { top, left, width, height } = glob.currentElem.getBoundingClientRect();

		return { top, left, width, height };
	}

	onMouseDown = e => {
		if (e.target !== e.currentTarget) return;
		e.target.requestPointerLock();
		this.pressed = true;
	}

	onMouseMove = ({ nativeEvent: e }) => {
		if (!this.pressed) return;
		this.content = e.movementX + ' ' + e.movementY;
	}

	onMouseUp = e => {
		document.exitPointerLock();
		this.pressed = false;
	}

	render() {
		const { activeSides, getPosition } = this;

		return (
			<div
				onMouseDown={this.onMouseDown}
				onMouseMove={this.onMouseMove}
				onMouseUp={this.onMouseUp}
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
				{ this.content }
			</div>
		)
	}
};

@observer
class Grid extends Component {
	@observable rows = [200, 300, 200, 300];

	@observable columns = [200, 300, 200, 300];

	direction = 'rows';

	current = 0

  onMouseDown = (index, direction) => {
  	this.direction = direction;
  	this.current = index;
  	document.addEventListener('mousemove', this.onMouseMove);
  	document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseUp = e => {
  	document.removeEventListener('mousemove', this.onMouseMove);
  	document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = e => {
  	e.preventDefault();
  	const delta = this.direction === 'rows' ? e.movementY : e.movementX;
  	this[this.direction][this.current] += delta;
  	this[this.direction][this.current + 1] -= delta;
  }

  render() {
    return (
	    <div
	    	style={{
	    		position: 'relative',
	    		margin: 30,
	    	}}
	    >
	      <div
	      	style={{
	      		display: 'flex',
	      		flexDirection: 'column',
	      		position: 'absolute',
	      		left: -30,
	      	}}
	      >
	      	{ this.rows.map((row, index) => [
	      		<div
		      		style={{
		      			display: 'grid',
		      			justifyContent: 'center',
		      			alignContent: 'center',
				        boxSizing: 'border-box',
		      			width: 30,
		      			height: row,
		      			border: '1px solid'
		      		}}
		      	>
		      		{ row }
		      	</div>,
	      		index < this.rows.length - 1 ? (
			        <div
			        	style={{
			        		boxSizing: 'border-box',
			        		cursor: 'row-resize',
			        		width: 30,
			        		height: 8,
			        		margin: `${5 - 4}px 0px`,
			        		border: '1px solid',
			        	}}
			        	draggable={false}
			        	onMouseDown={() => this.onMouseDown(index, 'rows')}
			        />
		        ) : null
	      	])}
	      </div>
	      <div
	      	style={{
	      		display: 'flex',
	      		position: 'absolute',
	      		top: -30,
	      	}}
	      >
	      	{ this.columns.map((column, index) => [
	      		<div
		      		style={{
		      			display: 'grid',
		      			justifyContent: 'center',
		      			alignContent: 'center',
				        boxSizing: 'border-box',
		      			height: 30,
		      			width: column,
		      			border: '1px solid',
		      		}}
	      		>
		      		<Input value={column} />
		      	</div>,
	      		index < this.columns.length - 1 ? (
			        <div
			        	style={{
			        		boxSizing: 'border-box',
			        		cursor: 'col-resize',
			        		height: 30,
			        		width: 8,
			        		margin: `0px ${5 - 4}px`,
			        		border: '1px solid',
			        	}}
			        	draggable={false}
			        	onMouseDown={() => this.onMouseDown(index, 'columns')}
			        />
		        ) : null
	      	])}
	      </div>
	      <div
		      style={{
		      	display: 'grid',
		      	gridGap: 10,
		      	gridTemplateColumns: this.columns.map(v => v + 'px').join(' '),
		      	gridTemplateRows: this.rows.map(v => v + 'px').join(' '),
		      }}
	      >
	      	{ this.columns.map((row, index) => (
		      	this.rows.map((column, index) => (
		      		<div
		      			style={{
		      				border: '1px dotted',
		      				gridColumn: 'span 1',
		      				gridRow: 'span 1',
		      			}}
		      		/>
		      	))
	      	))}
	      </div>
	      <div
	      	style={{
	      		position: 'absolute',
	      		bottom: -10,
	      		right: -10,
	      		width: 10,
	      		height: 10,
	      		border: '1px solid'
	      	}}
	      	onSizingMouseDown={this.onSizingMouseDown}
	      >

	      </div>
	    </div>
    )
  }
};

@observer
class Workplace extends Component {
	@observable scale = 1;

	@observable translateX = 0;
	@observable translateY = 0;

	@observable drag = false;

  zoom = (add, e) => {
  	console.log(e);
  	this.scale += add * 0.1;
  }

  onMouseDown = e => {
  	if (e.button === 1) {
  		e.preventDefault();
	  	this.drag = true;
	  	document.addEventListener('mousemove', this.onMouseMove);
	  	document.addEventListener('mouseup', this.onMouseUp);
  	}
  }

  onMouseUp = e => {
  	if (e.button === 1) {
	  	document.removeEventListener('mousemove', this.onMouseMove);
	  	document.removeEventListener('mouseup', this.onMouseUp);
  	}
  }

  onMouseMove = e => {
  	e.preventDefault();
	  this.drag = false;
  	this.translateX += e.movementX;
  	this.translateY += e.movementY;
  }

  render() {
  	return (
  		<div
  			style={{
  				transform: `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`
  			}}
  			onWheel={e => {
  				e.preventDefault();
  				this.zoom(-1 * e.deltaY / 100, e);
  			}}
  			onMouseDown={this.onMouseDown}
  		>
  			{ this.props.children }
  		</div>
  	)
  }
}

@observer
class Input extends Component {
	static defaultProps = {
		onChange: () => {},
		onChangeUnit: () => {},
		units: ['px', '%', 'fr'],
		unitsValue: 'px',
	}

	@observable openedUnits = false;

	onChange = e => {
		this.props.onChange(e);
	}

	onChangeUnit = e => {
		this.props.onChangeUnit(e);
	}

  render() {
  	return (
  		<div
  			style={{
  				display: 'inline-block',
  				position: 'relative',
  				...this.props.style,
  			}}
  		>
  			<input
  				style={{
  					width: '55px',
  				}}
  				value={this.props.value}
  				onChange={this.onChange}
  			/>
  			<div
  				style={{
  					position: 'absolute',
  					top: 0,
  					bottom: 0,
  					right: 5,
  					marginTop: 'auto',
  					marginBottom: 'auto',
  					height: 15,
  					width: 20,
  					backgroundColor: '#ccc',
  					fontSize: '15px',
  					lineHeight: '15px',
  					textAlign: 'center',
  				}}
  				onClick={() => this.openedUnits = !this.openedUnits}
  			>
  				{ this.props.unitsValue }
  				{ this.openedUnits ? (
		  			<div
		  				style={{
		  					display: 'flex',
		  					flexDirection: 'column',
		  					position: 'absolute',
		  					bottom: 15,
		  					left: 0,
		  					width: 20,
		  					backgroundColor: '#ccc',
		  					fontSize: '15px',
		  				}}
		  			>
		  				{ this.props.units.map(unit => (
				  			<div
				  				style={{
	  								height: 15,
				  					width: 20,
				  					backgroundColor: '#ccc',
				  					fontSize: '15px',
				  				}}
	  							onClick={this.onChangeUnit}
				  			>
				  				{ unit }
				  			</div>
		  				))}
		  			</div>
	  			) : null}
  			</div>
  		</div>
  	)
  }
}






ReactDOM.render(<Designer />, document.getElementById('root'));
registerServiceWorker();
