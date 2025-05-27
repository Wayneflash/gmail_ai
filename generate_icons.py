#!/usr/bin/env python3
"""
Gmail AI图标生成器
生成符合email AI主题的扩展图标
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_gmail_ai_icon(size):
    """创建Gmail AI主题图标"""
    # 创建画布
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 计算比例
    scale = size / 128
    
    # 背景渐变（紫色渐变）
    for y in range(size):
        for x in range(size):
            # 圆角矩形检查
            corner_radius = int(24 * scale)
            if (x < corner_radius and y < corner_radius):
                if (x - corner_radius)**2 + (y - corner_radius)**2 > corner_radius**2:
                    continue
            elif (x >= size - corner_radius and y < corner_radius):
                if (x - (size - corner_radius))**2 + (y - corner_radius)**2 > corner_radius**2:
                    continue
            elif (x < corner_radius and y >= size - corner_radius):
                if (x - corner_radius)**2 + (y - (size - corner_radius))**2 > corner_radius**2:
                    continue
            elif (x >= size - corner_radius and y >= size - corner_radius):
                if (x - (size - corner_radius))**2 + (y - (size - corner_radius))**2 > corner_radius**2:
                    continue
            
            # 渐变计算
            ratio = (x + y) / (2 * size)
            r = int(102 + (118 - 102) * ratio)  # 667eea -> 764ba2
            g = int(126 + (75 - 126) * ratio)
            b = int(234 + (162 - 234) * ratio)
            img.putpixel((x, y), (r, g, b, 255))
    
    # 邮件信封主体
    envelope_x = int(20 * scale)
    envelope_y = int(35 * scale)
    envelope_w = int(88 * scale)
    envelope_h = int(58 * scale)
    envelope_radius = int(8 * scale)
    
    # 绘制邮件信封（白色半透明）
    draw.rounded_rectangle(
        [envelope_x, envelope_y, envelope_x + envelope_w, envelope_y + envelope_h],
        radius=envelope_radius,
        fill=(255, 255, 255, 240),
        outline=(255, 255, 255, 80),
        width=1
    )
    
    # 邮件信封折叠线
    center_x = int(64 * scale)
    fold_y = int(67 * scale)
    left_x = int(20 * scale)
    right_x = int(108 * scale)
    fold_start_y = int(43 * scale)
    
    draw.line([left_x, fold_start_y, center_x, fold_y], fill=(102, 126, 234, 150), width=int(2 * scale))
    draw.line([center_x, fold_y, right_x, fold_start_y], fill=(102, 126, 234, 150), width=int(2 * scale))
    
    # AI神经网络节点
    ai_center_x = int(75 * scale)
    ai_center_y = int(25 * scale)
    
    # 主节点
    node_radius = int(3 * scale)
    draw.ellipse([ai_center_x - node_radius, ai_center_y - node_radius, 
                  ai_center_x + node_radius, ai_center_y + node_radius], 
                 fill=(66, 133, 244, 255))
    
    # 周围节点
    nodes = [
        (ai_center_x + int(12 * scale), ai_center_y - int(8 * scale), int(2.5 * scale)),
        (ai_center_x - int(10 * scale), ai_center_y + int(6 * scale), int(2.5 * scale)),
        (ai_center_x + int(8 * scale), ai_center_y + int(10 * scale), int(2 * scale)),
        (ai_center_x - int(8 * scale), ai_center_y - int(6 * scale), int(2 * scale))
    ]
    
    for node_x, node_y, radius in nodes:
        draw.ellipse([node_x - radius, node_y - radius, node_x + radius, node_y + radius], 
                     fill=(66, 133, 244, 200))
    
    # 连接线
    for node_x, node_y, _ in nodes:
        draw.line([ai_center_x, ai_center_y, node_x, node_y], 
                  fill=(66, 133, 244, 180), width=max(1, int(1.5 * scale)))
    
    # AI智能波纹
    wave_y = int(75 * scale)
    wave_start_x = int(32 * scale)
    
    # 简化的波纹效果
    step = max(1, int(4 * scale))  # 确保步长至少为1
    wave_width = max(4, int(32 * scale))  # 确保宽度至少为4
    
    for i in range(0, wave_width, step):
        x = wave_start_x + i
        y_offset = int(2 * scale) if i % max(1, int(8 * scale)) == 0 else 0
        point_size = max(1, int(1 * scale))
        draw.ellipse([x - point_size, wave_y + y_offset - point_size, 
                      x + point_size, wave_y + y_offset + point_size], 
                     fill=(66, 133, 244, 180))
    
    # 装饰光点
    light_points = [
        (int(25 * scale), int(25 * scale), int(1.5 * scale)),
        (int(103 * scale), int(103 * scale), int(1.5 * scale)),
        (int(103 * scale), int(25 * scale), int(1 * scale)),
        (int(25 * scale), int(103 * scale), int(1 * scale))
    ]
    
    for lx, ly, lr in light_points:
        if lx < size and ly < size:  # 确保在画布范围内
            draw.ellipse([lx - lr, ly - lr, lx + lr, ly + lr], 
                         fill=(255, 255, 255, 150))
    
    return img

def main():
    """生成所有尺寸的图标"""
    sizes = [16, 32, 48, 128]
    
    # 确保icons目录存在
    os.makedirs('icons', exist_ok=True)
    
    for size in sizes:
        print(f"生成 {size}x{size} 图标...")
        icon = create_gmail_ai_icon(size)
        icon.save(f'icons/icon{size}.png', 'PNG')
        print(f"✅ 已保存 icons/icon{size}.png")
    
    print("\n🎉 所有Gmail AI主题图标生成完成！")
    print("📧 新图标特点：")
    print("  - 紫色渐变背景（与AI按钮一致）")
    print("  - 邮件信封主体设计")
    print("  - AI神经网络节点")
    print("  - 智能波纹效果")
    print("  - 现代化圆角设计")

if __name__ == "__main__":
    main() 