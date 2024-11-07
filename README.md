# Start of Selection
# COMP5565 Project Description (25%)

**Reference Link (Lab 2):** [https://github.com/hyperledger/fabric-samples](https://github.com/hyperledger/fabric-samples)

**Group Formation:**
- Form a group of five students.
- Nominate a group leader.
- Enroll in one of the groups in Blackboard by **1st November 2024**.

## Background

The project will focus on creating a dApp on either **Ethereum**, which is public and permissionless, or **Hyperledger Fabric**, a private and permissioned blockchain, depending on the chosen privacy requirements. The dApp will enable a luxury jewelry maker to create digital certificates of authenticity for each diamond item they produce, which can be transferred to the buyer along with the physical product. Consumers will be able to verify the product’s authenticity by checking the certificate on the blockchain.

## Objectives

The main objective is to design and develop a user-friendly dApp that interacts with a blockchain to ensure the traceability and authenticity of luxury goods. In this project, choose **ONE** of the two blockchains (**Ethereum** OR **Hyperledger Fabric**).

### The DApp should:

1. **Provide a transparent audit trail** for the life cycle of each luxury item, including:
    - a. Mining the diamond (by mining company)
    - b. Cutting and polishing (by cutting company)
    - c. Controlling quality and laser engraving of unique ID (by grading lab)
    - d. Entering possession of the jewelry maker
    - e. Designing and inlaying the diamond into jewelry
    - f. Customer purchasing the jewelry or transferring ownership
2. **Allow manufacturers to issue and transfer digital certificates** tied to unique IDs.
3. **Enable consumers to verify the authenticity** of their purchases easily via a front end.
4. **Ensure the security, transparency, and privacy** of the system.

### To achieve this, you should:

1. **Outline the architecture** of the dApp, including smart contracts, user interfaces, and database design. Note that you will likely need to compromise on the transparency vs. privacy criteria.
2. **Implement your solution according to your architecture.** Ensure smart contracts are secure and optimized for gas usage (if Ethereum is chosen).
3. **Develop the frontend** to interact with the blockchain, directly or via a centralized backend.
4. **Deploy smart contracts** on a local Ethereum blockchain (Hardhat) or set up a network (Hyperledger Fabric).

## Project Parts

### Part 1: System Design (40 marks)

Write a report to provide details of the design of your system. Elaborate clearly on:
1. **Security**
2. **Accessibility of information**
3. **Efficiency of your implementation** (covered in Part 2)

**Justify your solution critically.**

### Part 2: System Implementation (40 marks)

Implement the system based on your design in Part 1. The system should use either **Ethereum** or **Hyperledger Fabric** blockchain frameworks. For the front-end of your applications, it can be:
- Desktop software (GUI/Terminal-based)
- Mobile app
- Website
- Or a combination of them

In the same report in Part 1, include a **detailed system installation guide**.

### Part 3: Presentation (20 marks)

You will give a **10-minute presentation** on your project on **28 November 2024 (Thursday)** in the last lecture session. The presentation should include:
- The design of your system
- A brief (**<4 minutes**) demonstration of your system(s) implemented at the time of presentation

The presentation schedule will be announced once the group formation is confirmed. The presentation is to be held **physically on campus**.

## Remarks

- Your report must **NOT exceed 30 pages**, excluding the cover page, including the table of contents and appendices of supplementary documents (e.g., diagrams, figures, and screenshots), with single line spacing and font size 12.
- Use **PDF** for the report only.
- Use the **APA** or **IEEE** standard to format all citations.

## Submission

- The submission deadline for the system, report, and slides is **23:59:00 1st December 2024 (Saturday)**. **No late submissions** are allowed.

### Group Leader Responsibilities:

Only the group leader has to submit the following:

#### Part 1
- **Report:** Use PDF format. Name the file using the following convention:
    - `Group<group_no>-report.pdf`, e.g., `Group99-report.pdf`
- **Slides:** Use PDF or PPTX format. Name the file using the following convention:
    - `Group<group_no>-slides.pptx`, e.g., `Group99-slides.pptx`
    - `Group<group_no>-slides.pdf`, e.g., `Group99-slides.pdf`

#### Part 2
- Put all your source codes into a single folder (which can contain multiple folders/subfolders). The files/folders must be organized properly to ensure easy deployment, based on the installation guide in Part 1.

**Note:** There is no need to submit the blockchain framework-related binaries (e.g., `node_modules`, and Docker containers for the Hyperledger Fabric network). Ensure you provide the detailed installation guidelines for your applications in the report.

- Zip the folder using the following naming convention:
    - `Group<group_no>.zip`, e.g., `Group99.zip`
- Submit the ZIP file to Blackboard. If the ZIP file is too large, upload it to your PolyU OneDrive storage. Save the link in a text file and submit the text file.

### Group Project Requirements

- Each group member must fill in the **Declaration of Contribution** (provided separately).
- Each student has to rank the contribution of their group members to the project, including themselves.
- Rename the form using the following naming convention:
    - `COMP5565_Declaration_Contribution_Form<group_no>-<studentID>.docx`
    - e.g., `COMP5565_Declaration_Contribution_Form99-1234567g.docx`

All members must submit the form on Blackboard under **“Project Declaration of Contribution Form”**. The aim of this form is to serve as a free-rider deterrent. In case of apparent inconsistency of ratings among group members, a special interview session may be arranged for the group. Students who fail to submit this form are subject to mark deduction.

## 项目分析

### 第一点：技术栈推荐

1. **区块链层**
    - Hyperledger Fabric
    - Go语言开发智能合约

2. **后端开发**
    - Go + Gin框架
    - Fabric SDK for Go

3. **前端开发**
    - React.js + JavaScript
    - Material-UI 组件库

4. **数据库**
    - 链下数据：MySQL（关系型数据库）
    - 缓存：Redis (Optional)

5. **开发工具**
    - Docker & Docker Compose（容器化）

### 第二点：System Design 分析

#### 功能需求：
1. 钻石全生命周期追踪（开采、切割、质检、制作、销售）
2. 数字证书的发行和转移
3. 产品真伪验证
4. 用户权限管理

#### 非功能需求：
1. **安全性：** 数据加密、访问控制
2. **性能：** 交易处理速度
3. **可扩展性**
4. **隐私保护**

### 第三点：系统架构详解

1. **客户端层 (Client Layer)**
    - **Web Frontend**
        - 管理员门户 (制造商、验证机构使用)
        - 消费者门户 (产品验证界面)
    - **API 接口层**
        - RESTful APIs
        - WebSocket (实时通知)

2. **应用服务层 (Application Layer)**
    - **API Gateway**
        - 请求路由
        - 负载均衡
        - 请求限流

    - **核心服务 (Core Services)**
        - **认证服务 (Authentication)**
            - 用户管理
            - 权限控制

        - **证书服务 (Certificate)**
            - 证书生成
            - 证书验证
            - 所有权转移

        - **产品服务 (Product)**
            - 产品信息管理
            - 生命周期追踪

    - **区块链交互层**
        - 交易提交
        - 状态查询

3. **区块链网络层 (Blockchain Layer)**
    - **Hyperledger Fabric Network**
        - **组织节点**
            - 矿业公司组织
            - 切割公司组织
            - 质检实验室组织
            - 珠宝制造商组织

        - 排序节点 (Ordering Service)
        - 通道配置 (Channels)

    - **智能合约 (Chaincode)**
        - 证书合约
        - 产品合约
        - 访问控制合约

4. **数据层 (Data Layer)**
    - **链上数据**
        - 证书信息
        - 所有权记录
        - 交易历史

    - **链下数据**
        - 用户信息 (PostgreSQL)
        - 产品详情 (PostgreSQL)
        - 缓存数据 (Redis)

### 第四点：数据流设计

#### A. 证书发行流程
1. 制造商登录 → 认证服务验证
2. 制造商创建产品信息 → 产品服务存储
3. 生成数字证书
    - 链下：存储详细信息
    - 链上：记录证书哈希和元数据
4. 触发智能合约
5. 更新区块链状态

#### B. 所有权转移流程
1. 验证当前所有权
2. 创建转移请求
3. 智能合约验证
4. 更新所有权状态
5. 发送通知给相关方

#### C. 真伪验证流程
1. 消费者扫描产品ID
2. 后端查询证书信息
    - 链上：验证真实性
    - 链下：获取详细信息
3. 返回验证结果

## 第五点：区块链和后端交互实现的详细理论

### 1. Fabric SDK 工作原理

**Fabric SDK 核心组件：**

1. **Gateway**
    - 网络连接管理
    - 身份管理
    - 交易提交

2. **Wallet**
    - 身份证书存储
    - 密钥管理

3. **Network**
    - 通道访问
    - 合约调用

4. **Contract**
    - 交易提交
    - 状态查询

### 2. 交易流程详解

**提交交易流程：**

1. 客户端发起请求
2. 后端服务处理
    - 验证请求
    - 准备交易提案
    - 组装参数

3. 交易提案
    - 创建提案
    - 发送至背书节点
    - 收集背书响应

4. 交易提交
    - 验证背书
    - 提交至排序服务
    - 等待区块确认

5. 事件监听
    - 区块事件
    - 链码事件