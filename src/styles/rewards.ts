const rewardsCss = `
        /* Variáveis CSS para facilitar a customização */
        :root {
          --reward-primary: #2196f3;
          --reward-primary-dark: #1976d2;
          --reward-secondary: #4caf50;
          --reward-error: #f44336;
          --reward-bg: #ffffff;
          --reward-text: #212121;
          --reward-text-secondary: #757575;
          --reward-border: rgba(0, 0, 0, 0.12);
          --reward-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          --reward-radius: 24px;
        }

        /* Container principal */
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
          max-width: 480px;
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
          background: linear-gradient(135deg, var(--reward-primary) 0%, var(--reward-primary-dark) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: white;
          position: relative;
          box-shadow: 0 10px 30px rgba(33, 150, 243, 0.3);
        }

        .reward-icon-wrapper::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--reward-primary) 0%, var(--reward-primary-dark) 100%);
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
          box-shadow: 0 4px 20px rgba(33, 150, 243, 0.25);
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
          box-shadow: 0 6px 30px rgba(33, 150, 243, 0.35);
        }

        .reward-button:active::before {
          width: 300px;
          height: 300px;
        }

        .reward-button svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
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

        /* Quiz Styles */
        .quiz-container {
          min-height: 300px;
          display: flex;
          flex-direction: column;
        }

        .quiz-progress {
          margin-bottom: 24px;
        }

        .quiz-progress-bar {
          height: 4px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .quiz-progress-fill {
          height: 100%;
          background: var(--reward-primary);
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .quiz-progress-text {
          margin-top: 8px;
          font-size: 14px;
          color: var(--reward-text-secondary);
        }

        .quiz-question {
          font-size: 20px;
          font-weight: 600;
          color: var(--reward-text);
          margin-bottom: 32px;
          line-height: 1.4;
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .quiz-option {
          background: white;
          border: 2px solid var(--reward-border);
          border-radius: 12px;
          padding: 16px 20px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 16px;
          font-weight: 500;
          color: var(--reward-text);
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .quiz-option::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background-color: var(--reward-primary-transparent);
          transition: width 0.3s;
        }

        .quiz-option:hover {
          border-color: var(--reward-primary);
          transform: translateX(4px);
        }

        .quiz-option:hover::before {
          width: 100%;
        }

        .quiz-option.selected {
          background: var(--reward-primary);
          color: white;
          border-color: var(--reward-primary);
          transform: translateX(4px) scale(0.98);
        }

        /* Animação de transição entre perguntas */
        @keyframes quiz-fade-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .quiz-question,
        .quiz-options {
          animation: quiz-fade-in 0.3s ease-out;
        }

        .quiz-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 24px;
        }

        .quiz-nav-button {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quiz-back {
          background: transparent;
          color: var(--reward-text-secondary);
          border: 1px solid var(--reward-border);
        }

        .quiz-back:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .quiz-next {
          background: var(--reward-primary);
          color: white;
          box-shadow: 0 2px 10px rgba(33, 150, 243, 0.3);
        }

        .quiz-next:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(33, 150, 243, 0.4);
        }

        .quiz-next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Completion Screen */
        .quiz-complete {
          text-align: center;
          padding: 40px 20px;
          animation: quiz-fade-in 0.4s ease-out;
        }

        .quiz-complete-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: var(--reward-secondary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: reward-bounce 0.6s ease-out;
          font-size: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 16px;

        }

        .quiz-complete .reward-button {
          background: var(--reward-secondary);
          box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
          margin-top: 24px;
        }

        .quiz-complete .reward-button:hover {
          box-shadow: 0 6px 30px rgba(76, 175, 80, 0.4);
        }

        @keyframes reward-bounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .quiz-complete-icon svg {
          width: 40px;
          height: 40px;
          stroke: white;
          stroke-width: 3;
        }

        /* Timer */
        .reward-timer {
          position: absolute;
          top: 24px;
          left: 24px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .reward-timer svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
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
      `;
export default rewardsCss;