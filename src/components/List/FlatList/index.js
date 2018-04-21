import React from 'react';
import PropTypes from 'prop-types';

const renderFlatList = ({
  filteredData,
  onItemClick = () => null,
  renderItem,
  selectedSection,
  selectedItem,
  sectionIndex,
  placeholder,
}) =>
  filteredData && filteredData.length > 0
    ? filteredData.map((item, index) => {
        const isSelected =
          selectedItem === index &&
          (selectedSection === sectionIndex || sectionIndex == null);

        return (
          <div onMouseDown={() => onItemClick(item)} key={item.id || index}>
            {renderItem({ item, index, isSelected })}
          </div>
        );
      })
    : placeholder != null ? placeholder : null;

renderFlatList.propTypes = {
  filteredData: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]),
  ),
  onItemClick: PropTypes.func,
  renderItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.number,
  selectedSection: PropTypes.number,
  sectionIndex: PropTypes.number,
  placeholder: PropTypes.node,
};

export default renderFlatList;
