import * as React from 'react'

export interface ICodeSplitProps {
  loadComponent: () => Promise<React.ComponentClass<any> | React.StatelessComponent<any>>
}
interface ICodeSplitState {
  component?: React.ComponentClass<any> | React.StatelessComponent<any>
  loading?: boolean,
  error?: any,
}

export class CodeSplit extends React.PureComponent<ICodeSplitProps, ICodeSplitState> {
  state = { loading: true } as ICodeSplitState

  async componentDidMount() {
    const { loadComponent } = this.props
    try {
      const component = await loadComponent()
      this.setState({ component, loading: false, error: undefined })
    } catch (error) {
      this.setState({ component: undefined, loading: false, error })
    }
  }

  async componentWillReceiveProps(nextProps) {
    this.setState({ component: undefined, loading: true, error: undefined })
    const { loadComponent } = nextProps
    try {
      const component = await loadComponent()
      this.setState({ component, loading: false, error: undefined })
    } catch (error) {
      this.setState({ component: undefined, loading: false, error })
    }
  }

  render() {
    const { component: Component, loading, error } = this.state

    if (loading) {
      return <div>Loading...</div>
    } else  if (error) {
      return <div>{`Failed: ${error.message || 'Unknown error'}`}</div>
    } else {
      return <Component />
    }
  }
}
