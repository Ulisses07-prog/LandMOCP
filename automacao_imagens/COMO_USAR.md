# 📸 Automação de Imagens e Vínculo com Catálogo

Esta pasta contém as ferramentas para processar novas imagens de fornecedores e vinculá-las ao catálogo sem duplicidade de fotos entre modelos de diferentes portas/gavetas.

---

## 🛠️ Passo 1: Renomear Imagens Automaticamente via OCR

Quando você tiver uma nova pasta com lâminas ou fotos de catálogo:

```bash
python automacao_imagens/renomear_novas_imagens_ocr.py "D:\SUA_PASTA_DE_FOTOS"
```

O script lê o cabeçalho impresso na imagem e identifica automaticamente:
* **Categoria:** Roupeiro, Cômoda, Cabeceira, Rack, etc.
* **Modelo:** Lana, Diana, Maya, Wanessa, etc.
* **Número de Portas/Gavetas:** 4 Portas, 6 Portas, 2 Portas, 5 Gavetas, etc.

*Exemplo de saída:*  
`ROUPEIRO_LANA_4PORTAS_00031.jpg`  
`ROUPEIRO_LANA_6PORTAS_00029.jpg`

---

## 🔗 Passo 2: Otimizar e Vincular ao Catálogo

Depois de renomeadas (ou ao adicionar fotos individuais de produtos na pasta `frontend/public/produtos/acp/`):

```bash
python automacao_imagens/vincular_ao_catalogo.py
```

O script faz o cruzamento inteligente:
* Roupeiro de **04 Portas** recebe apenas fotos de **04 Portas**.
* Roupeiro de **06 Portas** recebe apenas fotos de **06 Portas**.
* Cômodas recebem fotos compatíveis com seu número de gavetas.
* Atualiza simultaneamente o banco local e o banco de produção para o Render.
