import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
    const { data } = useData();
    const [index, setIndex] = useState(0);
    const byDateDesc = data?.focus.sort((evtA, evtB) =>
        new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
    );

    let timer;

    const timeout = () => {
        timer = setTimeout(() => {
            setIndex((prevIndex) =>
                prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0
            );
        }, 5000);
    };

    const nextCard = () => {
        if (data?.focus && data.focus.length > 1) {
            timeout();
        }
    };

    const pagination = (radioIdx) => {
        clearTimeout(timer);
        setIndex(radioIdx);
        timeout();
    };

    useEffect(() => {
        nextCard();
        return () => {
            clearTimeout(timer);
        };
    }, [index, byDateDesc, data]);

    if (!byDateDesc || byDateDesc.length === 0) {
        return null;
    }

    return (
        <div className="SlideCardList">
            {byDateDesc?.map((event, idx) => (
                <div key={uuidv4()}>
                    <div
                        className={`SlideCard SlideCard--${
                            index === idx ? "display" : "hide"
                        }`}
                    >
                        <img src={event.cover} alt="forum" />
                        <div className="SlideCard__descriptionContainer">
                            <div className="SlideCard__description">
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                <div>{getMonth(new Date(event.date))}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div className="SlideCard__paginationContainer" key={uuidv4()}>
                <div className="SlideCard__pagination">
                    {byDateDesc.map((_, radioIdx) => (
                        <input
                            key={uuidv4()}
                            type="radio"
                            name="radio-button"
                            defaultChecked={index === radioIdx}
                            onClick={() => pagination(radioIdx)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Slider;
