const rewardsCss = `
  /* Variáveis CSS para facilitar a customização */
  :root {
    --reward-primary: #0a213d;
    --reward-secundary: #1976d2;
    --reward-primary-rgb: 10, 33, 61;
    --reward-secundary-rgb: 25, 118, 210;
    --reward-error: #f44336;
    --reward-bg: #ffffff;
    --reward-text: #212121;
    --reward-text-secondary: #757575;
    --reward-border: rgba(0, 0, 0, 0.12);
    --reward-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    --reward-radius: 24px;
  }

  /* Container principal */
  body {
    font-family: 'Poppins', sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-weight: 400;
  }

  p {
    margin: 0px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  h2 {
    margin-top: 0px
  }

  .reward-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    animation: reward-fade-in 0.3s ease-out forwards;
  }

  @keyframes reward-fade-in {
    to { opacity: 1; }
  }

  /* Modal Container */
  .reward-modal {
    background: var(--reward-bg);
    border-radius: var(--reward-radius);
    box-shadow: var(--reward-shadow);
    max-width: 412px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    position: relative;
    transform: translateY(20px);
    animation: reward-slide-up 0.4s ease-out forwards;
  }

  @keyframes reward-slide-up {
    to { transform: translateY(0); }
  }

  /* Header */
  .reward-header {
    padding: 24px 24px 0;
    position: relative;
  }

  .reward-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    z-index: 10;
  }

  .reward-close:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: scale(1.1);
  }

  a:hover{
    color: #fff;
  }

  .reward-close svg {
    width: 20px;
    height: 20px;
    stroke: var(--reward-text);
  }

  /* Content */
  .reward-content {
    padding: 24px;
    text-align: center;
    overflow-y: auto;
    max-height: calc(90vh - 180px);
  }

  /* Icon Container */
  .reward-icon-wrapper {
    width: 120px;
    height: 120px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, var(--reward-primary) 0%, var(--reward-secundary) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 110px;
    color: white;
    position: relative;
    box-shadow: rgba(var(--reward-secundary-rgb), 0.3) 0 10px 30px ;
  }

  .reward-icon-wrapper::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--reward-primary) 0%, var(--reward-secundary) 100%);
    opacity: 0.2;
    z-index: -1;
    animation: reward-pulse 2s ease-in-out infinite;
  }

  @keyframes reward-pulse {
    0%, 100% { transform: scale(1); opacity: 0.2; }
    50% { transform: scale(1.1); opacity: 0.1; }
  }

  /* Typography */
  .reward-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--reward-text);
    margin-bottom: 12px;
    line-height: 1.3;
  }

  .reward-description {
    font-size: 16px;
    color: var(--reward-text-secondary);
    line-height: 1.5;
    margin-bottom: 32px;
  }

  /* Buttons */
  .reward-button {
    background: var(--reward-primary);
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: rgba(var(--reward-secundary-rgb), 0.25) 0px 4px 20px;
    position: relative;
    overflow: hidden;
  }

  .reward-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .reward-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 30px rgba(var(--reward-secundary-rgb), 0.35);
  }

  .reward-button:active::before {
    width: 300px;
    height: 300px;
  }

  /* Footer */
  .reward-footer {
    padding: 16px 24px;
    background: rgba(0, 0, 0, 0.02);
    text-align: center;
    font-size: 12px;
    color: var(--reward-text-secondary);
    border-top: 1px solid var(--reward-border);
  }

  /* Responsive */
  @media (max-width: 640px) {
    .reward-modal {
      max-width: 100%;
      margin: 0 10px;
    }

    .reward-content {
      padding: 20px;
    }

    .reward-icon-wrapper {
      width: 100px;
      height: 100px;
      font-size: 40px;
    }

    .reward-title {
      font-size: 20px;
    }

    .reward-description {
      font-size: 14px;
    }

    .quiz-question {
      font-size: 18px;
    }

    .quiz-option {
      padding: 14px 16px;
      font-size: 15px;
    }
  }

  @keyframes reward-shake {
    0%   { transform: translateX(0); }
    20%  { transform: translateX(-4px); }
    40%  { transform: translateX(4px); }
    60%  { transform: translateX(-2px); }
    80%  { transform: translateX(2px); }
    100% { transform: translateX(0); }
  }

  .reward-modal-wrapper.reward-shake {
    animation: reward-shake 0.3s ease;
  }
  `;
export default rewardsCss;