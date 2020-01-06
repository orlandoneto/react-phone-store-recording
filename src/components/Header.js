import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-6">Column number one</div>
                    <div className="col-6">
                        <span>
                            <i className="fas fa-home" />
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;