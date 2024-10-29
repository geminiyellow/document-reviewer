import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSplitPaneProps {
  defaultSplit: number;
  drawerWidth: number;
  isDrawerOpen: boolean;
  minLeftWidth: number;
  minRightWidth: number;
}

// 阻力区域配置
const RESISTANCE_RANGE = 50; // 阻力区域范围(px)
const RESISTANCE_FACTOR = 0.3; // 阻力系数

export const useSplitPane = ({
  defaultSplit,
  drawerWidth,
  isDrawerOpen,
  minLeftWidth,
  minRightWidth
}: UseSplitPaneProps) => {
  const [split, setSplit] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const [showLeft, setShowLeft] = useState(true);
  const [dragPreview, setDragPreview] = useState<number | null>(null);
  const [hasEnoughSpace, setHasEnoughSpace] = useState(true);
  const [isInResistanceZone, setIsInResistanceZone] = useState(false);
  const [isSnapped, setIsSnapped] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; split: number } | null>(null);

  const checkAvailableSpace = useCallback(() => {
    if (containerRef.current) {
      const availableWidth = containerRef.current.getBoundingClientRect().width - (isDrawerOpen ? drawerWidth : 0);
      const hasSpace = availableWidth >= minLeftWidth + minRightWidth;
      
      // 如果空间不足，强制进入折叠模式
      if (!hasSpace && !isSnapped) {
        setIsSnapped(true);
        setShowLeft(true); // 默认显示左侧
      }
      
      return hasSpace;
    }
    return true;
  }, [isDrawerOpen, drawerWidth, minLeftWidth, minRightWidth, isSnapped]);

  const calculateSplitFromWidth = useCallback((leftWidth: number, totalWidth: number) => {
    return (leftWidth / totalWidth) * 100;
  }, []);

  const calculateWidthFromSplit = useCallback((splitPercentage: number, totalWidth: number) => {
    return (totalWidth * splitPercentage) / 100;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (containerRef.current) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        split: split
      };
      setIsSnapped(false);
    }
  }, [split]);

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current || !dragStartRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const availableWidth = containerRect.width - (isDrawerOpen ? drawerWidth : 0);
    
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaSplit = (deltaX / availableWidth) * 100;
    let newSplit = dragStartRef.current.split + deltaSplit;

    const leftWidth = calculateWidthFromSplit(newSplit, availableWidth);
    const rightWidth = availableWidth - leftWidth;

    // 计算阻力区域边界
    const leftResistanceStart = minLeftWidth;
    const leftResistanceEnd = minLeftWidth - RESISTANCE_RANGE;
    const rightResistanceStart = availableWidth - minRightWidth;
    const rightResistanceEnd = rightResistanceStart + RESISTANCE_RANGE;

    // 检查是否在阻力区域内
    const isInLeftResistance = leftWidth > leftResistanceEnd && leftWidth < leftResistanceStart;
    const isInRightResistance = leftWidth > rightResistanceStart && leftWidth < rightResistanceEnd;
    
    setIsInResistanceZone(isInLeftResistance || isInRightResistance);

    if (leftWidth <= leftResistanceEnd) {
      // 超过左侧阻力区域，自动吸附到左边
      setShowLeft(false);
      setIsSnapped(true);
      setIsDragging(false);
      return;
    } else if (leftWidth >= rightResistanceEnd) {
      // 超过右侧阻力区域，自动吸附到右边
      setShowLeft(true);
      setIsSnapped(true);
      setIsDragging(false);
      return;
    } else if (isInLeftResistance || isInRightResistance) {
      // 在阻力区域内应用阻力效果
      const resistancePoint = isInLeftResistance ? leftResistanceStart : rightResistanceStart;
      const currentPoint = leftWidth;
      const distance = Math.abs(currentPoint - resistancePoint);
      const resistanceFactor = 1 - (distance / RESISTANCE_RANGE) * (1 - RESISTANCE_FACTOR);
      
      newSplit = dragStartRef.current.split + deltaSplit * resistanceFactor;
    }

    // 设置新的分割位置
    setDragPreview(newSplit);
  }, [isDragging, isDrawerOpen, drawerWidth, minLeftWidth, minRightWidth, calculateWidthFromSplit]);

  const handleGlobalMouseUp = useCallback(() => {
    if (dragPreview !== null && !isSnapped) {
      if (hasEnoughSpace) {
        const availableWidth = containerRef.current?.getBoundingClientRect().width || 0;
        const leftWidth = calculateWidthFromSplit(dragPreview, availableWidth);

        // 如果在阻力区域释放，吸附到最小宽度
        if (Math.abs(leftWidth - minLeftWidth) < RESISTANCE_RANGE) {
          setSplit(calculateSplitFromWidth(minLeftWidth, availableWidth));
        } else if (Math.abs(leftWidth - (availableWidth - minRightWidth)) < RESISTANCE_RANGE) {
          setSplit(calculateSplitFromWidth(availableWidth - minRightWidth, availableWidth));
        } else {
          setSplit(dragPreview);
        }
      }
    }
    setIsDragging(false);
    setDragPreview(null);
    dragStartRef.current = null;
    setIsInResistanceZone(false);
  }, [dragPreview, isSnapped, hasEnoughSpace, minLeftWidth, minRightWidth, calculateSplitFromWidth, calculateWidthFromSplit]);

  const toggleView = useCallback(() => {
    if (isSnapped || !hasEnoughSpace) {
      setShowLeft(prev => !prev);
      if (hasEnoughSpace) {
        // 展开时吸附到最小宽度
        const availableWidth = containerRef.current?.getBoundingClientRect().width || 0;
        if (!showLeft) {
          setSplit(calculateSplitFromWidth(minLeftWidth, availableWidth));
        } else {
          setSplit(calculateSplitFromWidth(availableWidth - minRightWidth, availableWidth));
        }
        setIsSnapped(false);
      }
    }
  }, [isSnapped, hasEnoughSpace, showLeft, minLeftWidth, minRightWidth, calculateSplitFromWidth]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, handleGlobalMouseMove, handleGlobalMouseUp]);

  useEffect(() => {
    const updateSpace = () => {
      const hasSpace = checkAvailableSpace();
      setHasEnoughSpace(hasSpace);
    };

    updateSpace();
    window.addEventListener('resize', updateSpace);
    return () => window.removeEventListener('resize', updateSpace);
  }, [checkAvailableSpace]);

  return {
    split: dragPreview ?? split,
    isDragging,
    showLeft,
    hasEnoughSpace,
    isInResistanceZone,
    isSnapped,
    containerRef,
    handleMouseDown,
    toggleView
  };
};