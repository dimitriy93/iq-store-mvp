import { Link } from "react-router";

export const Header = () => (
    <div className="header">
        <nav>
            <Link to="/catalog">Главная</Link>
            <Link to="/cart">Корзина</Link>
            <Link to="/bluetooth">Bluetooth</Link>
        </nav>
    </div>
)