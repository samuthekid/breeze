import groupBy from 'lodash/groupBy';
import { compose, withProps, withState, withHandlers } from 'recompose';

const enhance = compose(
  withProps(({ filter, data, filterKey, sectionFunc }) => {
    const filteredData =
      filter && filter !== ''
        ? data.filter(item => {
            const target = filterKey.split('.').reduce((a, b) => {
              if (a && a[b]) return a[b];
              return null;
            }, item);
            return target
              ? target.toLowerCase().includes(filter.toLowerCase())
              : null;
          })
        : data;

    const sections =
      sectionFunc != null ? groupBy(filteredData, sectionFunc) : null;

    return {
      sections,
      filteredData,
    };
  }),
  withState('selectedSection', 'setSelectedSection', 0),
  withState('selectedItem', 'setSelectedItem', 0),
  withHandlers({
    handleKeyDown: props => e => {
      if (!props.selectable) return;

      const sectionsLength =
        props.sections != null && Object.keys(props.sections).length;
      const currentSection =
        props.sections != null &&
        props.sections[Object.keys(props.sections)[props.selectedSection]];

      const previousSection =
        props.sections != null &&
        props.selectedSection > 0 &&
        props.sections[Object.keys(props.sections)[props.selectedSection - 1]];

      switch (e.keyCode) {
        case 27:
          props.toggleDropdown != null && props.toggleDropdown();
          break;
        case 38:
          e.preventDefault();
          if (props.selectedItem > 0) {
            props.setSelectedItem(props.selectedItem - 1);
          } else if (props.sections && props.selectedSection > 0) {
            props.setSelectedSection(props.selectedSection - 1);
            props.setSelectedItem(previousSection.length - 1);
          }
          break;
        case 40:
          e.preventDefault();
          if (!props.sections) {
            if (props.selectedItem < props.filteredData.length - 1) {
              props.setSelectedItem(props.selectedItem + 1);
            }
          } else if (props.selectedItem < currentSection.length - 1) {
            props.setSelectedItem(props.selectedItem + 1);
          } else if (props.selectedSection < sectionsLength - 1) {
            props.setSelectedSection(props.selectedSection + 1);
            props.setSelectedItem(0);
          }

          break;
        case 13:
          e.preventDefault();
          if (!props.sections)
            props.onItemClick(props.filteredData[props.selectedItem]);
          else props.onItemClick(currentSection[props.selectedItem]);
          break;
        default:
          break;
      }
    },
  }),
);

export default enhance;
