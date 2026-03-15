// Chrome Tabs Exporter - Popup Script
// 实现核心标签页导出功能

// 调试日志工具函数
function debugLog(message, data = null) {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[Chrome Tabs Exporter] ${timestamp}: ${message}`, data);
  } else {
    console.log(`[Chrome Tabs Exporter] ${timestamp}: ${message}`);
  }
}

function debugError(message, error = null) {
  const timestamp = new Date().toISOString();
  if (error) {
    console.error(`[Chrome Tabs Exporter] ${timestamp}: ${message}`, error);
  } else {
    console.error(`[Chrome Tabs Exporter] ${timestamp}: ${message}`);
  }
}

// 获取所有窗口和标签页信息
async function getAllWindowsAndTabs() {
  debugLog('开始获取所有窗口和标签页信息');
  
  try {
    // 获取所有窗口（包含标签页信息）
    const windows = await chrome.windows.getAll({ populate: true });
    
    let totalTabs = 0;
    let totalValidTabs = 0;
    let windowDetails = [];
    
    windows.forEach((window, index) => {
      const validTabs = window.tabs.filter(tab => 
        tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))
      );
      
      totalTabs += window.tabs.length;
      totalValidTabs += validTabs.length;
      
      windowDetails.push({
        windowId: window.id,
        windowIndex: index + 1,
        focused: window.focused,
        totalTabs: window.tabs.length,
        validTabs: validTabs.length,
        pinnedTabs: window.tabs.filter(tab => tab.pinned).length
      });
    });
    
    debugLog(`成功获取窗口和标签页信息`, {
      totalWindows: windows.length,
      totalTabs: totalTabs,
      totalValidTabs: totalValidTabs,
      windowDetails: windowDetails
    });
    
    return { windows, totalTabs, totalValidTabs };
  } catch (error) {
    debugError('获取窗口和标签页失败', error);
    throw error;
  }
}

// 获取并显示标签页数量 (Subtask 3.1)
async function updateTabCount() {
  debugLog('开始获取标签页数量');
  
  try {
    const { totalTabs, totalValidTabs } = await getAllWindowsAndTabs();
    
    debugLog(`成功获取标签页数量: ${totalTabs} (有效: ${totalValidTabs})`);
    
    document.getElementById('tabCount').textContent = totalTabs;
    return totalTabs;
  } catch (error) {
    // 处理 Chrome API 权限错误 (Subtask 7.1)
    debugError('获取标签页失败', error);
    
    if (error.message && error.message.includes('permissions')) {
      showMessage('权限错误：无法访问标签页信息，请检查扩展权限', 'error');
    } else {
      showMessage('无法获取标签页信息', 'error');
    }
    console.error('Error getting tabs:', error);
    return 0;
  }
}

// 生成按窗口分组的导出文件内容 (Subtask 3.2)
function generateExportContent(windows) {
  debugLog('开始生成按窗口分组的导出内容');
  
  const now = new Date();
  const timestamp = now.toISOString();
  
  // 统计所有窗口的标签页
  let totalTabs = 0;
  let totalValidTabs = 0;
  let totalWindows = windows.length;
  
  windows.forEach(window => {
    totalTabs += window.tabs.length;
    const validTabs = window.tabs.filter(tab => 
      tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))
    );
    totalValidTabs += validTabs.length;
  });
  
  debugLog('导出统计信息', {
    totalWindows: totalWindows,
    totalTabs: totalTabs,
    totalValidTabs: totalValidTabs
  });
  
  // 生成文件头部
  let content = `# Chrome Tabs Export (按窗口分组)\n`;
  content += `# Date: ${timestamp}\n`;
  content += `# Total Windows: ${totalWindows}\n`;
  content += `# Total Tabs: ${totalValidTabs}\n\n`;
  
  // 按窗口分组导出
  windows.forEach((window, index) => {
    const windowNumber = index + 1;
    const focusedText = window.focused ? ' (当前窗口)' : '';
    
    // 过滤有效标签页
    const validTabs = window.tabs.filter(tab => 
      tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))
    );
    
    const pinnedTabs = validTabs.filter(tab => tab.pinned);
    const regularTabs = validTabs.filter(tab => !tab.pinned);
    
    if (validTabs.length === 0) {
      debugLog(`窗口 ${windowNumber} 没有有效标签页，跳过`);
      return; // 跳过没有有效标签页的窗口
    }
    
    // 窗口标题
    content += `## 窗口 ${windowNumber}${focusedText} - ${validTabs.length} 个标签页\n`;
    
    // 固定标签页
    if (pinnedTabs.length > 0) {
      content += `# 固定标签页 (${pinnedTabs.length} 个)\n`;
      pinnedTabs.forEach(tab => {
        content += `${tab.url}\n`;
      });
      content += `\n`;
    }
    
    // 普通标签页
    if (regularTabs.length > 0) {
      content += `# 普通标签页 (${regularTabs.length} 个)\n`;
      regularTabs.forEach(tab => {
        content += `${tab.url}\n`;
      });
      content += `\n`;
    }
    
    debugLog(`窗口 ${windowNumber} 导出完成`, {
      windowId: window.id,
      totalTabs: window.tabs.length,
      validTabs: validTabs.length,
      pinnedTabs: pinnedTabs.length,
      regularTabs: regularTabs.length
    });
  });
  
  debugLog(`导出内容生成完成，包含 ${totalValidTabs} 个有效URL，分布在 ${totalWindows} 个窗口中`);
  
  return content;
}

// 生成文件名
function generateFilename() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const filename = `tabs_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.txt`;
  debugLog(`生成文件名: ${filename}`);
  
  return filename;
}

// 导出标签页
async function exportTabs() {
  debugLog('开始导出标签页操作');
  
  const btn = document.getElementById('exportBtn');
  btn.disabled = true;
  btn.textContent = '导出中...';
  
  try {
    // 获取所有窗口和标签页
    debugLog('查询所有窗口和标签页');
    const { windows, totalTabs, totalValidTabs } = await getAllWindowsAndTabs();
    
    debugLog(`查询到 ${windows.length} 个窗口，共 ${totalTabs} 个标签页`);
    
    // 添加空标签页验证 (Subtask 7.2)
    if (totalTabs === 0) {
      debugLog('没有打开的标签页，终止导出');
      showMessage('警告：没有打开的标签页，无法导出', 'error');
      return;
    }
    
    debugLog(`有效标签页数量: ${totalValidTabs}`);
    
    if (totalValidTabs === 0) {
      debugLog('没有有效的标签页，终止导出');
      showMessage('警告：没有有效的标签页可导出（仅支持 http/https 协议）', 'error');
      return;
    }
    
    // 生成按窗口分组的文件内容
    debugLog('生成按窗口分组的导出文件内容');
    const content = generateExportContent(windows);
    
    // 创建 Blob 并生成下载 URL
    debugLog('创建文件 Blob');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    debugLog('Blob 创建成功', {
      size: blob.size,
      type: blob.type
    });
    
    // 触发下载
    const filename = generateFilename();
    
    try {
      debugLog(`开始下载文件: ${filename}`);
      
      const downloadId = await chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: false  // 直接保存到下载目录
      });
      
      debugLog(`文件下载成功，下载ID: ${downloadId}`);
      showMessage(`成功导出 ${totalValidTabs} 个标签页 (${windows.length} 个窗口)`, 'success');
      
    } catch (downloadError) {
      // 处理 downloads.download() 失败 (Subtask 7.1)
      debugError('文件下载失败', downloadError);
      
      if (downloadError.message && downloadError.message.includes('permissions')) {
        showMessage('权限错误：无法下载文件，请检查下载权限', 'error');
      } else {
        showMessage('文件下载失败：' + downloadError.message, 'error');
      }
    }
    
    // 清理 URL
    setTimeout(() => {
      URL.revokeObjectURL(url);
      debugLog('Blob URL 已清理');
    }, 1000);
    
  } catch (error) {
    // 处理 API 权限错误 (Subtask 7.1)
    debugError('导出操作失败', error);
    
    if (error.message && error.message.includes('permissions')) {
      showMessage('权限错误：无法访问标签页，请检查扩展权限', 'error');
    } else {
      showMessage('导出失败: ' + error.message, 'error');
    }
  } finally {
    btn.disabled = false;
    btn.textContent = '导出标签页';
    debugLog('导出操作完成，按钮状态已恢复');
  }
}

// 显示消息系统 (Subtask 7.3)
function showMessage(text, type) {
  debugLog(`显示消息: [${type}] ${text}`);
  
  const messageDiv = document.getElementById('message');
  
  // 清除之前的定时器（如果存在）
  if (messageDiv.hideTimer) {
    clearTimeout(messageDiv.hideTimer);
    messageDiv.hideTimer = null;
    debugLog('清除之前的消息隐藏定时器');
  }
  
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';
  
  // 3秒后自动隐藏成功消息
  if (type === 'success') {
    messageDiv.hideTimer = setTimeout(() => {
      messageDiv.style.display = 'none';
      messageDiv.hideTimer = null;
      debugLog('成功消息已自动隐藏');
    }, 3000);
  }
  
  // 记录消息到控制台用于调试
  if (type === 'error') {
    console.error('User message:', text);
  } else {
    console.log('User message:', text);
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  debugLog('扩展弹出窗口初始化开始');
  debugLog('浏览器信息', {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform
  });
  
  try {
    await updateTabCount();
    document.getElementById('exportBtn').addEventListener('click', exportTabs);
    debugLog('扩展初始化完成，事件监听器已添加');
  } catch (error) {
    debugError('扩展初始化失败', error);
    showMessage('扩展初始化失败', 'error');
  }
});