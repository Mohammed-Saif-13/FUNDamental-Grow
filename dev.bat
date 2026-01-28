@echo off
taskkill /F /IM node.exe 2>nul
bun dev
