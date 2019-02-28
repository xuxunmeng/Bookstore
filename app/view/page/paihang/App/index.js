import React from 'react'
import { getPaihangCatalog, updatePaihangCatalog, getPaihangDetail } from '../../util/services'
// import RoundSlider from '../roundSlider'
import './index.less'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: 0,
    }
  }

  componentDidMount() {
    this.getCatalog()
    this.getData()
  }

  getData = () => {
    this.timeout = setTimeout(() => {
      getPaihangDetail().then(res => {
        console.log('123131', res)
        this.getData()
      })
    }, 3000)
  }

  getCatalog = () => {
    getPaihangCatalog({
      navId: 1,
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.error(err)
    })
  }

  upate = () => {
    const { value } = this.state
    console.log('==> value', value)
    updatePaihangCatalog({
      navId: 2,
      catalogId: value,
    }).then(res => {
      console.log('===> res', res)
    })
  }

  onChange = (e) => {
    console.log(e.target.value)
    this.setState({
      value: e.target.value,
    })
  }

  render() {
    return (
      <div className="app">
        <div className="wrapper">
          <div className="channel">
            <input type="text" value={this.state.value} onChange={this.onChange} />
            <a onClick={this.upate}>click</a>
            {/* <RoundSlider
              value={100}
              rotationOffset={-45}
              arcSize={270}
              allowClick={true}
            /> */}
          </div>
        </div>
      </div>
    )
  }
}

export default App
