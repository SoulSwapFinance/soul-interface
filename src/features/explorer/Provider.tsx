import React, { Component } from "react";
import { connect } from "react-redux";
import {
	updateERC20Markets,
} from "state/spot/actions";
// import withWeb3Account from "components/hoc/withWeb3Account";
import {
	UPDATE_ERC20_MARKETS,
} from "constants/index";
// import { toast } from "react-hot-toast";
import { withRouter } from "next/router";

class Provider extends Component {
	// _activatePollingUpdates = () => {
	// 	// Enables realtime updates of the token markets
	// 	if (!this._updateERC20MarketsInterval && UPDATE_ERC20_MARKETS !== 0) {
	// 		this.props.onUpdateERC20Markets();
	// 	}
	// };

	// componentDidMount = async (prevProps, prevState) => {
	// 	this._activatePollingUpdates();
	// 	if (!this.props.web3.account) {
	// 		toast("Please connect to your wallet for better experience", {
	// 			icon: "📌",
	// 		});
	// 	}
	// };

	// componentWillUnmount = () => {
	// 	clearInterval(this._updateERC20MarketsInterval);
	// };

	// render = () => this.props.children;
}

const mapDispatchToProps = (dispatch) => {
	return {
		onUpdateERC20Markets: () => dispatch(updateERC20Markets()),
	};
};

// export default withRouter(connect(null, mapDispatchToProps)(withWeb3Account(Provider)));