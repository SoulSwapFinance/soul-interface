// import styled from 'styled-components'

//dark // {
// //     --primary-background-color: #2b3040;
// //     --primary-text-color: white;
// //     --secondary-background-color: #40465a;
// //     --secondary-text-color: #8d98bb;
// //     --interact-background-color: #7697d7;
// //     --interact-text-color: white;
// //     --overlay-background-color: black;
// //     --action-background-color: #f6b400;
// //     --info-background-color: #4163ab;
// //     --info-text-color: #ffffff;
// //     --error-background-color: #a83838;
// //     --error-text-color: #ffffff;
// //     --usd-background-color: #3c5e52;
// //     --usd-text-color: #cdfee1;
// //   }


//     .swap {
//       position: relative;
//       margin-top: 0px;
//       height: 5px;
//       pointer-events: none;
//       .spinner {
//         position: absolute;
//         left: 50%;
//         top: 50%;
//         transform: translate(-50%, -50%);
//         z-index: 2;
//         // color: var(--secondary-text-color);
//         color: var(--action-background-color);
//         transition: opacity 500ms linear;
//         pointer-events: none;
//       }
  
//       > button {
//         color: var(--secondary-text-color);
//         background-color: var(--secondary-background-color);
//         display: inline-block;
//         padding: 9px;
//         display: flex;
//         align-items: center;
//         border-radius: 999999px;
//         border: 5px solid var(--primary-background-color);
//         position: absolute;
//         top: 50%;
//         transform: translate(-50%, -50%);
//         left: 50%;
//         cursor: pointer;
//         pointer-events: all;
//         z-index: 1;
//         &:hover {
//           color: var(--interact-text-color);
//           background-color: var(--interact-background-color);
//         }
//       }
  
//       & + * {
//         margin-top: 0;
//       }
//     }
  
//       .controls {
//         display: flex;
//         position: absolute;
//         top: 0px;
//         left: 50%;
//         transform: translate(-50%, 0);
//         border: 4px solid var(--primary-background-color);
//         border-top: 0;
//         border-radius: 0 0 6px 6px;
//         overflow: hidden;
  
//         .vr {
//           width: 4px;
//           background-color: var(--primary-background-color);
//         }
  
//         > button {
//           border: unset;
//           width: 50px;
//           padding-top: 5px;
//           padding-bottom: 3px;
//           font: inherit;
//           font-weight: 500;
//           font-size: 0.6em;
//           cursor: pointer;
//           color: var(--secondary-text-color);
//           background-color: var(--secondary-background-color);
//           &:hover {
//             color: var(--interact-text-color);
//             background-color: var(--interact-background-color);
//           }
//           &:disabled {
//             cursor: not-allowed;
//           }
//         }
//       }
  
//       .amount {
//         flex-grow: 1;
//         background-color: unset;
//         display: block;
//         padding: 28px;
//         padding-bottom: 36px;
//         padding-top: 22px;
//         border: unset;
//         font: inherit;
//         color: inherit;
//         text-align: right;
//         line-height: 1.4;
//         text-overflow: ellipsis;
//         overflow: hidden;
//         &::placeholder {
//           color: var(--primary-text-color);
//           opacity: 0.5;
//         }
//       }
  
//       .usd {
//         font-size: 0.75em;
//         line-height: 1;
//         padding: 7px 28px;
//         margin: 0;
//         background-color: var(--usd-background-color);
//         border-radius: 8px 0 8px 0;
//         color: var(--usd-text-color);
//         font-weight: 500;
//         position: absolute;
//         bottom: 0px;
//         right: 0;
//         pointer-events: none;
//       }
  
//       .token-select-button {
//         padding: 20px;
//         padding-left: 20px;
//         border: hidden;
//         cursor: pointer;
//         font: inherit;
//         color: inherit;
//         flex-shrink: 0;
//         display: flex;
//         gap: 6px;
//         align-items: center;
//         background-color: transparent;
  
//         .token-and-chain-logo {
//           margin: -20px 0;
//           margin-right: 5px;
//           position: relative;
  
//           .token-logo {
//             display: block;
//             object-fit: contain;
//             object-position: center;
//           }
//           .chain-logo {
//             position: absolute;
//             object-fit: contain;
//             bottom: -2px;
//             right: -2px;
//             padding: 3px;
//             width: 20px;
//             height: 20px;
//             border-radius: 99999px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }
//         }
//       }
//     }
  
//     .swap-button {
//       cursor: pointer;
//       padding: 15px;
//       background-color: var(--action-background-color);
//       font: inherit;
//       font-weight: 500;
//       color: white;
//       border: none;
//       border-radius: 4px;
//       display: block;
//       width: 100%;
//     }
//   }
  
//   // ---------- TOKEN SELECT -----------
  
//   .chain-select {
//     width: 100%;
//     height: 100%;
//     pointer-events: none;
//     background-color: var(--primary-background-color);
//     position: absolute;
//     top: 0;
//     left: 0;
//     padding: 10px;
//     z-index: 10;
//     transition: all 125ms ease;
//     border-radius: 8px;
  
//     .chains-title {
//       padding: 20px 0 32px 0;
//       font-size: 1.2em;
//       text-align: center;
//       color: var(--primary-text-color);
//     }
  
//     .chains {
//       display: flex;
//       gap: 10px;
//       flex-direction: column;
//       .chain {
//         border-radius: 4px;
//         padding: 10px;
//         padding-right: 14px;
//         gap: 8px;
//         display: flex;
//         cursor: pointer;
//         display: flex;
//         align-items: center;
//         border: unset;
//         font: inherit;
//         color: white;
//         width: 100%;
//       }
//     }
//   }
  
//   .token-select-overlay {
//     width: 100vw;
//     height: 100vh;
//     position: fixed;
//     top: 0;
//     left: 0;
//     z-index: 1000;
//     opacity: 0;
//     transition: opacity 125ms ease;
//   }
  
//   .token-select-background {
//     background-color: var(--overlay-background-color);
//     width: 100%;
//     height: 100%;
//     opacity: 0.8;
//     position: absolute;
//     top: 0;
//     left: 0;
//   }
  
//   .token-select-modal {
//     height: 95vh;
//     max-height: 768px;
//     max-width: 28ch;
//     width: 100%;
//     position: fixed;
//     left: 50%;
//     top: 50%;
//     overflow: hidden;
//     transition: transform 100ms ease;
//     font-family: "Square", sans-serif;
//     font-size: 18px;
//     border-radius: 8px;
//   }
  
//   .token-select {
//     width: 100%;
//     height: 100%;
//     color: var(--primary-text-color);
//     background-color: var(--primary-background-color);
//     display: flex;
//     flex-direction: column;
//     transition: all 125ms ease;
//     border-radius: 8px;
//   }
  
//   .token-select-head {
//     box-shadow: 0 2px 8px #0000001c;
//     padding: 10px;
  
//     form {
//       margin-top: 10px;
  
//       .tokens-filter {
//         border: unset;
//         padding: 10px;
//         color: var(--primary-text-color);
//         background-color: var(--secondary-background-color);
//         display: block;
//         width: 100%;
//         font: inherit;
//         border-radius: 4px;
//         &::placeholder {
//           color: var(--primary-text-color);
//           opacity: 0.5;
//         }
//       }
//     }
  
//     .selected-chain {
//       border-radius: 4px;
//       border: none;
//       font: inherit;
//       color: white;
//       padding: 10px;
//       padding-right: 14px;
//       display: flex;
//       align-items: center;
//       width: 100%;
//       gap: 8px;
//       cursor: pointer;
//     }
//   }
  
//   .tokens-list {
//     overflow: auto;
//     height: 100%;
//     > div {
//       padding: 10px;
//       cursor: pointer;
//       user-select: none;
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       .token-name {
//         flex-grow: 1;
//       }
//       .token-favorite {
//         color: var(--action-background-color);
//       }
//       &:hover {
//         background-color: var(--secondary-background-color);
//       }
//     }
//   }
  
//   // ---------- CONFIRMATION -------------
  
//   .confirmation-overlay {
//     width: 100%;
//     height: 100%;
//     position: absolute;
//     top: 0;
//     left: 0;
//     z-index: 1000;
//     opacity: 0;
//     transition: opacity 125ms ease;
//   }
  
//   .confirmation-background {
//     background-color: var(--overlay-background-color);
//     width: 100%;
//     height: 100%;
//     opacity: 0.8;
//     position: absolute;
//     top: 0;
//     left: 0;
//   }
  
//   .confirmation {
//     max-width: 45ch;
//     width: 100%;
//     color: var(--primary-text-color);
//     background-color: var(--primary-background-color);
//     border-radius: 8px;
//     font-family: "Square", sans-serif;
//     color: var(--primary-text-color);
//     font-size: 18px;
//     position: fixed;
//     left: 50%;
//     top: 50%;
//     overflow: hidden;
//     display: flex;
//     flex-direction: column;
//     transition: all 100ms ease;
//   }
  
//   .transaction {
//     padding: 40px;
  
//     .usd {
//       padding: 5px 8px;
//       margin: -5px -8px;
//       border-radius: 3px;
//       font-size: 0.95em;
//       font-weight: 500;
//       background-color: var(--usd-background-color);
//       color: var(--usd-text-color);
//     }
  
//     .transaction-direction {
//       position: relative;
//       height: 8px;
  
//       > svg {
//         height: 16px;
//         width: 20%;
//         display: block;
//         background-color: var(--secondary-background-color);
//         border: 8px solid var(--primary-background-color);
//         z-index: 10;
//         color: var(--secondary-text-color);
//         position: absolute;
//         left: 50%;
//         top: 50%;
//         transform: translate(-50%, -50%);
//         border-radius: 999999px;
//         padding: 7px;
//         box-sizing: content-box;
//       }
//     }
  
//     .transaction-side {
//       background-color: var(--secondary-background-color);
//       padding: 20px 24px;
//       border-radius: 6px;
  
//       > * + * {
//         margin-top: 0.2em;
//       }
  
//       .transaction-amount {
//         font-weight: 500;
//         font-size: 1.65em;
//       }
  
//       .transaction-token {
//         display: flex;
//         align-items: center;
//         font-size: 0.75em;
//         font-weight: 600;
//         gap: 4px;
//       }
//     }
//   }
  
//   .confirmation-prompt {
//     padding: 20px 40px;
//     background-color: var(--info-background-color);
//     color: var(--info-text-color);
//     text-align: center;
//   }
  
//   .poor-prompt {
//     padding: 20px 40px;
//     background-color: var(--error-background-color);
//     color: var(--error-text-color);
//     text-align: center;
//   }
  