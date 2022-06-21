import React, { ReactElement } from 'react';
import Icon, { IconProp, SizeProp } from '../Basic/Icon/Icon';
import { VeryLightGrey } from '../../Utils/BrandColors';
export interface ComponentProps {
    onChange: (search: string) => void;
}

const SearchBox = (props: ComponentProps): ReactElement => {
    return (
        <form className="app-search d-none d-lg-block">
            <div className="position-relative">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    onChange={(e) => {
                        props.onChange(e.target.value);
                    }}
                />
                <button
                    className="btn"
                    type="button"
                    disabled={true}
                    style={{
                        border: 'none',
                        color: VeryLightGrey.toString(),
                    }}
                >
                    <Icon
                        className="light"
                        icon={IconProp.Search}
                        size={SizeProp.Large}
                    />
                </button>
            </div>
        </form>
    );
};

export default SearchBox;
