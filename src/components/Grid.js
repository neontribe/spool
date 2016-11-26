import React, { Component } from 'react';

import styles from './css/Grid.module.css';

// Todo: Make responsive to viewport size changes

export default class Grid extends Component {
    constructor (props) {
        super(props);

        this.state = {
            height: 0,
            width: 0
        };

        this.getStyle = this.getStyle.bind(this);
        this.updateDimentions = this.updateDimentions.bind(this);

        window.addEventListener('resize', this.updateDimentions);
    }

    componentDidMount () {
        // Now that the DOM has been drawn we can measure the container dimentions
        this.updateDimentions();
    }

    updateDimentions () {
        this.setState({
            height: this.refs.grid.offsetHeight,
            width: this.refs.grid.offsetWidth
        });
    }

    getStyle () {
        var containerHeight = this.state.height;
        var containerWidth = this.state.width;
        var contentLength = React.Children.count(this.props.children);
        var itemStyle = [];
        var length, i = 0;

        if (this.props.callToAction) {
            contentLength++;
        }

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

        // Determine the grid item dimentions and position, based on how
        // many items we need to display
        switch (contentLength) {
            case 1:
            default: {
                // length = _.min(containerHeight, containerWidth) / 2;

                length = calculateMaxCellSize(2);

                for (; i < contentLength; i++) {
                    itemStyle[i] = {
                        height: length,
                        width: length
                    }
                }

                break;
            }

            case 2: {
                // length = containerWidth / 2;

                length = calculateMaxCellSize(2);

                for (; i < contentLength; i++) {
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
                // length = containerHeight / 2;

                length = calculateMaxCellSize(6);

                for (; i < contentLength; i++) {
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
                // length = containerHeight / 2;

                length = calculateMaxCellSize(4);

                for (; i < contentLength; i++) {
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
                // length = containerWidth / 3;

                length = calculateMaxCellSize(6);

                for (; i < contentLength; i++) {
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
                // length = containerWidth / 3;

                length = calculateMaxCellSize(6);

                for (; i < contentLength; i++) {
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
                length = containerWidth / 4;

                // Todo: Won't work until the container dimentions are set (CSS)
                // for the /add/about screen:
                // length = calculateMaxCellSize(8);

                for (; i < contentLength; i++) {
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
        var childrenCount = React.Children.count(this.props.children);

        return (
            <div ref='grid' className={styles.gridWrapper}>
                <ul className={styles.grid}>
                    {React.Children.map(this.props.children, (content, i) => (
                        <li key={i} className={styles.item} style={itemStyle[i]}>
                            <div className={styles.content}>
                                {content}
                            </div>
                        </li>
                    ))}

                    {this.props.callToAction && (
                        <li className={styles.item} style={itemStyle[childrenCount]}>
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
