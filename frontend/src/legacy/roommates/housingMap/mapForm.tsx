import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { FlyToInterpolator, Popup } from 'react-map-gl';

import { ColocInfo } from './colocInfo';
import { Housing } from './interfaces';

export function MapForm(props): JSX.Element {
  const { colocs, data, setViewPort, setPopUpinfo } = props;

  return (
    <div className="col-12 col-md-6 col-lg-5 col-xl-4">
      <Form.Group className="mb-2">
        <Typeahead
          id="search-colocs"
          options={colocs}
          placeholder="Recherche"
          onChange={(coloc) => {
            if (typeof coloc[0] === 'undefined') {
              return;
            }
            const housings: Housing[] = data.filter(
              (housing) => housing.id === coloc[0].housing.id,
            );
            if (typeof housings[0] === 'undefined') return;
            const housing: Housing = housings[0];
            setViewPort({
              zoom: 16,
              longitude: housing.longitude,
              latitude: housing.latitude,
              transitionDuration: 500,
              transitionInterpolator: new FlyToInterpolator(),
            });
            setPopUpinfo(
              <Popup
                tipSize={10}
                anchor="bottom"
                longitude={housing.longitude}
                latitude={housing.latitude}
                closeOnClick={false}
                onClose={() => setPopUpinfo(null)}
                dynamicPosition={false}
                offsetTop={-10}
                offsetLeft={10}
              >
                <ColocInfo housing={housing} colocathlonOnly={false} />
              </Popup>,
            );
          }}
        />
      </Form.Group>
    </div>
  );
}
