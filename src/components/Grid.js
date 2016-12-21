import React, { Component } from 'react';
import _ from 'lodash';

import styles from './css/Grid.module.css';

export default class Grid extends Component {
    constructor (props) {
        super(props);

        this.state = {
            height: 0,
            width: 0,

            // Boolean hack which allows us to determine an appropriate wrapper
            // class to apply during the render
            rendered: false
        };

        this.getStyle = this.getStyle.bind(this);
        this.onResize = this.onResize.bind(this);
        this.updateDimentions = this.updateDimentions.bind(this);

        window.addEventListener('resize', this.onResize, false);
    }

    componentDidMount () {
        // Now that the DOM has been drawn we can measure the container dimentions
        this.updateDimentions();
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.onResize, false);
    }

    onResize () {
        this.setState({
            rendered: false
        });

        this.updateDimentions();
    }

    updateDimentions () {
        if (this.refs.grid) {
            this.setState({
                height: this.refs.grid.offsetHeight,
                width: this.refs.grid.offsetWidth,
                rendered: true
            });
        }
    }

    // Determine the grid item dimentions and position, based on how many items
    // we need to display
    getStyle () {
        var containerHeight = this.state.height;
        var containerWidth = this.state.width;
        var itemStyle = [];
        var length, i = 0;

        var children = _.filter(React.Children.toArray(this.props.children), (child) => {
            return child !== false;
        })

        if (this.props.callToAction) {
            children.length++;
        }

        // Packing algorithm to determine the most efficient way to fit N items
        // inside the container
        function calculateMaxCellSize (itemCount) {
            var maxSize = Math.sqrt((containerHeight * containerWidth) / itemCount);
            var numberOfPossibleWholeTilesH = Math.floor(containerHeight / maxSize);
            var numberOfPossibleWholeTilesW = Math.floor(containerWidth / maxSize);
            var total = numberOfPossibleWholeTilesH * numberOfPossibleWholeTilesW;

            while (total < itemCount) {
                maxSize--;
                numberOfPossibleWholeTilesH = Math.floor(containerHeight / maxSize);
                numberOfPossibleWholeTilesW = Math.floor(containerWidth / maxSize);
                total = numberOfPossibleWholeTilesH * numberOfPossibleWholeTilesW;
            }

            return maxSize;
        }

        switch (children.length) {
            case 1:
            default: {
                length = calculateMaxCellSize(2);

                itemStyle[0] = {
                    height: length,
                    width: length
                }

                break;
            }

            case 2: {
                length = calculateMaxCellSize(2);

                for (; i < children.length; i++) {
                    itemStyle[i] = {
                        height: length,
                        width: length
                    }
                }

                if (!this.props.enforceConsistentSize) {
                    itemStyle[1].width /= 2;
                }

                break;
            }

            case 3: {
                length = calculateMaxCellSize(6);

                for (; i < children.length; i++) {
                    itemStyle[i] = {
                        height: length,
                        width: length
                    }
                }

                if (!this.props.enforceConsistentSize) {
                    itemStyle[0].height *= 2;
                    itemStyle[0].width *= 2;
                    itemStyle[2].marginTop = length;
                    itemStyle[2].marginLeft = -length;
                }

                break;
            }

            case 4: {
                length = calculateMaxCellSize(4);

                for (; i < children.length; i++) {
                    itemStyle[i] = {
                        height: length,
                        width: length
                    }
                }

                itemStyle[2].marginTop = length;
                itemStyle[2].marginLeft = -(length * 2);
                itemStyle[3].marginTop = length;
                break;
            }

            case 5: {
                length = calculateMaxCellSize(6);

                for (; i < children.length; i++) {
                    itemStyle[i] = {
                        height: length,
                        width: length
                    }
                }

                itemStyle[2].marginTop = length;
                itemStyle[2].marginLeft = -(length * 2);
                itemStyle[3].marginTop = length;

                if (!this.props.enforceConsistentSize) {
                    itemStyle[4].height *= 2;
                }

                break;
            }

            case 6: {
                length = calculateMaxCellSize(6);

                for (; i < children.length; i++) {
                    itemStyle[i] = {
                        height: length,
                        width: length
                    }
                }

                itemStyle[2].marginTop = length;
                itemStyle[2].marginLeft = -(length * 2);
                itemStyle[3].marginTop = length;
                itemStyle[5].marginTop = length;
                itemStyle[5].marginLeft = -length;
                break;
            }

            case 8: {
                length = calculateMaxCellSize(8);

                for (; i < children.length; i++) {
                    itemStyle[i] = {
                        height: length,
                        width: length
                    }
                }

                itemStyle[4].marginTop = length;
                itemStyle[4].marginLeft = -(length * 4);
                itemStyle[5].marginTop = length;
                itemStyle[6].marginTop = length;
                itemStyle[7].marginTop = length;
            }
        }

        return itemStyle;
    }

    render () {
        var itemStyle = this.getStyle();
        var children = _.filter(React.Children.toArray(this.props.children), (child) => {
            return child !== false;
        });

        // Sets the `flex` style property back to its default once the grid has
        // determined how best to utilise the available screen real-estate.
        // This allows us to vertically re-center the page content.
        var className = (this.refs.grid && this.state.rendered)
            ? styles.gridWrapperNext
            : styles.gridWrapper;

        return (
            <div ref='grid' className={className}>
                <ul className={styles.grid}>
                    {React.Children.map(this.props.children, (content, i) => (
                        <li key={i} className={styles.item} style={itemStyle[i]}>
                            <div className={styles.content}>
                                {content}
                            </div>
                        </li>
                    ))}

                    {this.props.callToAction && (
                        <li className={styles.item} style={itemStyle[children.length]}>
                            <div className={styles.content}>
                                {this.props.callToAction}
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

Grid.propTypes = {
    // Makes all grid items equal width
    enforceConsistentSize: React.PropTypes.bool,

    // Appends an element as the last grid item
    callToAction: React.PropTypes.element
}

Grid.defaultProps = {
    enforceConsistentSize: false
}
