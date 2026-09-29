import "../../assets/css/radial-menu.scss";

import info from "../../assets/info.png";

interface RadialMenuProps {
    items: string[];
}

const RadialMenu = ({ items }: RadialMenuProps) => {
    return (
        <div className="radial-menu">

            <input type="checkbox" id="toggle" />

            {items.map((item, index) => (
                <label
                    key={index}
                    className={`item item-${index + 1}`}
                    htmlFor="toggle"
                >
                    {item}
                </label>
            ))}

            <label className="main" htmlFor="toggle">
                <img src={info} />
            </label>

        </div>
    );
};

export default RadialMenu;