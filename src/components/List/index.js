import React from 'react';
import PropTypes from 'prop-types';

import renderFlatList from './FlatList';
import enhance from './connections';

export class List extends React.Component {
  static propTypes = {
    sections: PropTypes.shape(),
    filteredData: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]),
    ),
    onItemClick: PropTypes.func,
    style: PropTypes.string,
    renderItem: PropTypes.func.isRequired,
    footer: PropTypes.element,
    height: PropTypes.string,
    selectedItem: PropTypes.number,
    selectedSection: PropTypes.number,
    renderSeparator: PropTypes.func,
    handleKeyDown: PropTypes.func.isRequired,
    placeholder: PropTypes.node,
    selectable: PropTypes.bool,
    scroll: PropTypes.bool,
  };

  componentDidMount() {
    this.props.selectable &&
      document.addEventListener('keydown', this.props.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.selectable ||
      !this.props.scroll ||
      this.props.selectedItem === prevProps.selectedItem
    )
      return;

    let nextEle = null;

    if (this.props.sections != null) {
      const first =
        this.props.selectedItem === 0 && this.props.selectedSection === 0;
      // If first grab first section header otherwise
      // Get selected section and grab selectedElement from section list (children[1])
      nextEle = first
        ? this.scrollableDiv.children[this.props.selectedSection]
            .firstElementChild
        : this.scrollableDiv.children[this.props.selectedSection].children[
            this.props.selectedItem + 1
          ];
    } else {
      nextEle = this.scrollableDiv.children[this.props.selectedItem];
    }

    nextEle.scrollIntoViewIfNeeded(false);
  }

  componentWillUnmount() {
    this.props.selectable &&
      document.removeEventListener('keydown', this.props.handleKeyDown);
  }

  scrollableDiv = null;

  saveScrollableDiv = r => {
    this.scrollableDiv = r;
  };

  renderSections() {
    const {
      sections,
      onItemClick,
      renderItem,
      selectedSection,
      selectedItem,
      renderSeparator,
    } = this.props;

    return Object.keys(sections).map((section, i) => (
      <div key={section}>
        {renderSeparator({
          item: section,
          data: sections[section],
          index: i,
        })}
        {renderFlatList({
          filteredData: sections[section],
          onItemClick,
          renderItem,
          selectedSection,
          sectionIndex: i,
          selectedItem,
        })}
      </div>
    ));
  }

  render() {
    const {
      sections,
      onItemClick,
      style,
      renderItem,
      selectedSection,
      selectedItem,
      placeholder,
      scroll,
      height,
      filteredData,
      footer,
    } = this.props;

    const withData =
      (sections != null && Object.keys(sections).length) ||
      (filteredData != null && filteredData.length !== 0);

    return withData ? (
      <div
        ref={this.saveScrollableDiv}
        className={style}
        style={{ overflowY: scroll && 'scroll', maxHeight: height }}
      >
        {sections == null
          ? renderFlatList({
              filteredData,
              onItemClick,
              renderItem,
              selectedSection,
              selectedItem,
              placeholder,
            })
          : this.renderSections()}
        {footer}
      </div>
    ) : placeholder != null ? (
      placeholder
    ) : null;
  }
}

export default enhance(List);
