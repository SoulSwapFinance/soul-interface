import styled from "styled-components";

export const Header = styled.div`
  font-family: "proxima-nova", sans-serif;
  background-color: ${ "black" };
  height: ${(props) => props.theme.topBarSize}px;
  padding: 0 4rem 0 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: white;
`;

export const Body = styled.div`
  font-family: "proxima-nova", sans-serif;
  background-color: ${ "black" };
  color: white;
  display: flex;
  font-size: calc(10px + 2vmin);
  min-height: calc(100vh);
  display: flex;
  flex-direction: row;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  button {
    font-family: inherit;
  }
`;

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: #61dafb;
  margin-top: 10px;
`;

export const WrapA = styled.a`
  text-decoration: none;
  cursor: pointer;
`;

export const LinkExt = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: ${ "white" };

  :visited {
    color: ${ "white"};
  }
`;

export const Heading1 = styled.div`
  font-size: 32px;
  font-weight: bold;
`;

export const Heading2 = styled.div`
  font-size: 26px;
  font-weight: bold;
`;

export const Heading3 = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

export const Typo1 = styled.div`
  font-size: 18px;
`;

export const Typo2 = styled.div`
  font-size: 16px;
`;

export const Typo3 = styled.div`
  font-size: 14px;
`;

export const OverlayButton = styled.button<{ disabled?: boolean }>`
  background-color: transparent;
  border: none;
  text-decoration: none;
  cursor: ${(props) => !props.disabled && "pointer"};
  color: inherit;
  font-family: "proxima-nova", sans-serif;
  transition: 0.2s all;

  :active {
    transform: ${(props) => !props.disabled && "scale(0.98)"};
  }
`;

export const Button = styled.button<{
  variant: "primary" | "secondary" | "tertiary";
  padding?: string;
  color?: string;
  fontSize?: string;
  disabled?: boolean;
  width?: string;
}>`
  background-color: ${(props) =>
    props.variant === "primary"
      ? "blue"
      : props.variant === "secondary"
      ? "transparent"
      : "white"
  };
  border: ${(props) =>
    props.variant === "primary" || props.variant === "tertiary"
      ? "none"
      : `1px solid ${"white"}`};
  border-radius: 8px;
  color: ${(props) => (!props.disabled ? props.color || "white" : "#6c726c")};
  cursor: ${(props) => (!props.disabled ? "pointer" : "cursor")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "18px")};
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  padding: ${(props) => (props.padding ? props.padding : "14px 24px")};
  transition: 0.2s all;
  width: ${(props) => props.width && props.width};

  ${(props) => props.hidden && "hidden"} :focus {
    border: ${(props) => props.variant === "primary" && "none"};
    outline: none;
  }

  :active {
    transform: ${(props) => !props.disabled && "scale(0.98)"};
  }
`;

export const Container = styled.div<{ padding?: string }>`
  border: ${(props) => `1px solid ${ "white" }`};
  padding: ${(props) => (props.padding ? props.padding : "2rem")};
  background-color: ${ "black" };
  border-radius: 8px;
`;

export const ContentBox = styled.div<{ padding?: string }>`
  background-color: ${ "blue" };
  display: inline-flex;
  padding: ${(props) => (props.padding ? props.padding : "2rem")};
  border-radius: 8px;
`;

export const Input = styled.input<{
  fontSize?: string;
  fontWeight?: string;
  disabled?: boolean;
}>`
  flex: 1;
  background-color: transparent;
  border: none;
  color: white;
  font-size: ${(props) => props.fontSize || "20px"};
  font-weight: ${(props) => props.fontWeight && props.fontWeight};
  opacity: ${(props) => props.disabled && 0.6};

  :focus {
    outline: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  ::-webkit-input-placeholder {
    font-size: 16px;
    line-height: 3;
  }

  [type="number"] {
    -moz-appearance: textfield;
  }
`;

export const TextArea = styled.textarea`
  font-family: "proxima-nova", sans-serif;
  flex: 1;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 20px;
  padding-top: 1.5rem;
  height: 170px;
  resize: none;
  line-height: 24px;

  :focus {
    outline: none;
  }
`;