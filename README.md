# Start of Selection
# COMP5565 Project Description (25%)

**Notion** [https://www.notion.so/Dapp-Project-13db4678c2ed80349e13dac5a2f9fe5e?pvs=4](https://www.notion.so/Dapp-Project-13db4678c2ed80349e13dac5a2f9fe5e?pvs=4)

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