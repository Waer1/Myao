export const slider = {
  position: "relative",
  height: "1000hv",
  display: "flex",
  justifyContent: "center",
  alignCtems: "center",
  top: { xs: "30%", md: "10%" },
};

export const image = {
  //width: '40rem',
  width: {
    xs: 280,
    sm: 400,
    md: 300,
    lg: 400,
    xl: 800,
  },
  height: "30rem",
};

export const right_arrow = {
  position: "absolute",
  top: "50%",
  right: {
    xs: -100,
    md: -120,
  },
  fontSize: 50,
  color: "#000",
  zIndex: 10,
  cursor: "pointer",
  userSelect: "none",
};

export const left_arrow = {
  position: "absolute",
  top: "50%",
  left: {
    xs: -100,
    md: -120,
  },
  fontSize: 50,
  color: "#000",
  zIndex: 10,
  cursor: "pointer",
  userSelect: "none",
};

export const slide = {
  opacity: 0,
  transitionDuration: "1s ease",
};

export const slide_active = {
  opacity: 1,
  transform: "scale(1.08)",
};
