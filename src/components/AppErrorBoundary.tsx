import { Component, type ReactNode } from 'react';
export class AppErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<main className="profile-app profile-login-page"><section className="profile-panel"><h1>We couldn’t display this page</h1><p>Your saved workshop records are still on the server. Reload the dashboard to continue.</p><button className="profile-button primary" onClick={()=>window.location.reload()}>Reload dashboard</button></section></main>:this.props.children;}
}
