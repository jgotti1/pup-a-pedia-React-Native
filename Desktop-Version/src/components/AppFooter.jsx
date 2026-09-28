import Icon from "./Icon";
import "./AppFooter.css";

export default function AppFooter({ version }) {
  return (
    <footer className="footer">
      <div className="footer__inner u-shell">
        <div className="footer__brand">
          <span className="footer__brand-text">
            Pup <span className="footer__brand-paw">A</span> Pedia
          </span>
          <span className="footer__version">v{version}</span>
        </div>

        <p className="footer__note">
          Breed ratings are general guidance, not a substitute for meeting a dog.
        </p>

        <a className="footer__link" href="https://johnmargotti.com/" target="_blank" rel="noreferrer">
          © margotticode
          <Icon name="external" size={13} />
        </a>
      </div>
    </footer>
  );
}
