import * as React from 'react'
import { CodeSplit } from './CodeSplit'

interface IAppState {
  view: 'home' | 'about'
}

export class App extends React.PureComponent<{}, IAppState> {
  state = { view: 'home' } as IAppState

  render() {
    console.log(this.state)
    return (
      <div>
        <h1>App</h1>
        <div>
          <button onClick={() => this.setState({ view: 'home' })}>Home</button>
          <button onClick={() => this.setState({ view: 'about' })}>About</button>
        </div>
        <div>
          {this.renderView()}
        </div>
      </div>
    )
  }

  renderView() {
    switch (this.state.view) {
      case 'home': return <CodeSplit loadComponent={() => import('./views/HomeView').then(m => m.HomeView)} />
      case 'about': return <CodeSplit loadComponent={() => import('./views/AboutView').then(m => m.AboutView)} />
    }
  }
}

export function notUsed() {
  return 'Not used, will not be in production build!'
}
