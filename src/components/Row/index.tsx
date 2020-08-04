import React, { useRef, useEffect, Children } from 'react';

import classnames from '../../utils/classNames';

import { IProps } from './types';

import './index.scss';

const baseClass = 'vant-layout';

const Row = ({
  children,
  type,
  gutter,
  justify = 'start',
  align = 'center'
}: IProps) => {
  const rowProps = {
    className: classnames(`${baseClass}__row`, []),
    style: {}
  };

  if (justify)
    Object.assign(rowProps, {
      style: {
        ...rowProps.style,
        justifyContent: justify
      }
    });
  if (align)
    Object.assign(rowProps, {
      style: {
        ...rowProps.style,
        alignItem: align
      }
    });

  if (Children.count(children) === 1) {
    children = [children];
  }
  const groups: number[][] = [[]];

  let totalSpan = 0;

  children.forEach((child, index) => {
    totalSpan += Number(child.props.span);
    if (child.props.offset) {
      totalSpan += Number(child.props.offset);
    }
    if (totalSpan > 24) {
      groups.push([index]);
      totalSpan -= 24;
    } else {
      groups[groups.length - 1].push(index);
    }
    return groups;
  });

  const displayArray: string[] = [];

  groups.forEach((group, index) => {
    if (index === 0) {
      group.forEach((item) => {
        displayArray.push('block');
      });
    } else {
      group.forEach((item) => {
        displayArray.push('none');
      });
    }
    return displayArray;
  });

  const gutterArray: object[] = [];

  if (gutter) {
    const averageGutter = Number(gutter) / 2;
    groups[0].forEach((group, index) => {
      if (index === 0) {
        console.log(groups[0].length - 1);
        gutterArray.push({ right: averageGutter });
      } else if (index > 0 && index < groups[0].length - 1) {
        console.log(1);
        gutterArray.push({ left: averageGutter, right: averageGutter });
      } else {
        gutterArray.push({ left: averageGutter });
      }
      return gutterArray;
    });
  }

  const childrenWithProps = children?.map((child, index) =>
    React.cloneElement(child, {
      groups,
      display: displayArray[index],
      gutter: gutterArray[index]
    })
  );

  return <div {...rowProps}>{childrenWithProps}</div>;
};

export default Row;