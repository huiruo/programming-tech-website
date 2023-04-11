set rtp +=~/.config/nvim
"set number

" plug
call plug#begin('~/.config/nvim/autoload')
Plug 'one-dark/onedark.nvim'
Plug 'preservim/nerdtree'

"Plug 'godlygeek/tabular'
"Plug 'preservim/vim-markdown'

Plug 'akinsho/bufferline.nvim', { 'tag': 'v3.*' }

"Plug 'neovim/nvim-lspconfig'
"Plug 'hrsh7th/cmp-nvim-lsp'
Plug 'hrsh7th/cmp-buffer'
"Plug 'hrsh7th/cmp-path'
Plug 'hrsh7th/cmp-cmdline'
Plug 'hrsh7th/nvim-cmp'

call plug#end()

colorscheme onedark
"autocmd VimEnter * NERDTree

set termguicolors
lua << EOF
require("bufferline").setup{}
EOF

let NERDTreeWinPos='left'
let NERDTreeWinSize=20

"let g:vim_markdown_folding_disabled = 1

" 常用
noremap Z :q <CR>
noremap <space> :
inoremap jk <Esc>
"快速切换到行首行尾
noremap H ^
noremap L $

map T :NERDTreeToggle<CR>
" markdown code block
nmap Y i##<space>
nmap F i```<CR>```<Up><CR>