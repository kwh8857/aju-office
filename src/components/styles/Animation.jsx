import styled from "styled-components";

export const Animation = styled.div`
  @keyframes arrow-moving {
    from {
      opacity: 0.1;
      transform: translateY(30px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  animation: arrow-moving 0.6s;
  animation-timing-function: cubic-bezier(0.8, -0.03, 0.31, 0.93);
`;
