import type { NextPageContext } from "next";

type ErrorProps = {
  statusCode: number;
};

function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b0b0b",
        color: "#efe7df",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "24px"
      }}
    >
      <div
        style={{
          border: "1px solid rgba(205,0,0,0.35)",
          background: "#121212",
          padding: "28px",
          textAlign: "center",
          width: "100%",
          maxWidth: "560px"
        }}
      >
        <p style={{ margin: 0, color: "#cd0000", letterSpacing: "0.16em", fontSize: "12px" }}>
          SMSM STORE
        </p>
        <h1 style={{ margin: "10px 0 0", fontSize: "30px", fontWeight: 800 }}>
          {statusCode === 404 ? "Page Not Found" : "Unexpected Error"}
        </h1>
        <p style={{ marginTop: "10px", color: "#cbc3b8", fontSize: "14px" }}>
          Error code: {statusCode}
        </p>
      </div>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};

export default ErrorPage;
