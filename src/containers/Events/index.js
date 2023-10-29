import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
    const { data, error } = useData();
    const [type, setType] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    const filteredArray = data?.events.filter((event) => {
        if (!type || event.type === type) {
            return true;
        }
        return false;
    });

    const filteredEvents = (
        (!type ? data?.events : filteredArray) || []
    ).filter((event, index) => {
        if (
            (currentPage - 1) * PER_PAGE <= index &&
            PER_PAGE * currentPage > index
        ) {
            return true;
        }
        return false;
    });

    // const changeType = (evtType) => {
    //     setCurrentPage(1);
    //     setType(evtType);
    // };
    const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
    const typeList = new Set(data?.events.map((event) => event.type));
    return (
        <>
            {error && <div>An error occured</div>}
            {data === null ? (
                "loading"
            ) : (
                <>
                    <h3 className="SelectTitle">Catégories</h3>
                    <Select
                        selection={Array.from(typeList)}
                        setType={setType}
                        onChange={() => setCurrentPage(1)}
                    />
                    <div id="events" className="ListContainer">
                        {filteredEvents.map((event) => (
                            <Modal
                                key={uuidv4()}
                                Content={<ModalEvent event={event} />}
                            >
                                {({ setIsOpened }) => (
                                    <EventCard
                                        onClick={() => setIsOpened(true)}
                                        imageSrc={event.cover}
                                        title={event.title}
                                        date={new Date(event.date)}
                                        label={event.type}
                                        key={uuidv4()}
                                    />
                                )}
                            </Modal>
                        ))}
                    </div>
                    <div className="Pagination">
                        {[...Array(pageNumber || 0)].map((_, n) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <a
                                key={uuidv4()}
                                href="#events"
                                onClick={() => setCurrentPage(n + 1)}
                            >
                                {n + 1}
                            </a>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default EventList;
