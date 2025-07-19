document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();
    
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = "smooth";
  
  // Handle smooth scrolling with offset for fixed navbar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Navbar hide on scroll
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    if (lastScrollY < window.scrollY) {
      // Scrolling down
      navbar.classList.add('navbar-hidden');
    } else {
      // Scrolling up
      navbar.classList.remove('navbar-hidden');
    }
    lastScrollY = window.scrollY;
  });
  
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show-mobile-menu');
      
      // Toggle icon
      const icon = mobileMenuBtn.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show-mobile-menu');
        
        // Reset icon
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
  }
  
  // Handle contact form submission
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Show success message
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Thank you! Your message has been sent successfully.';
          formStatus.style.display = 'block';
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Show error message
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Oops! There was a problem sending your message. Please try again.';
        formStatus.style.display = 'block';
        console.error('Form submission error:', error);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        // Scroll to status message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide status message after 5 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      }
    });
  }

  const generateBtn = document.getElementById("generate-btn");
  const resetBtn = document.getElementById("reset-btn");
  const promptInput = document.getElementById("prompt");
  const loaderContainer = document.querySelector(".loader-container");
  const loadingText = document.getElementById("loading-text");
  const outputSection = document.getElementById("output-section");
  const previewFrame = document.getElementById("preview-frame");
  const openInTabBtn = document.getElementById("open-in-tab-btn");
  const htmlCode = document.getElementById("html-code");
  const cssCode = document.getElementById("css-code");
  const jsCode = document.getElementById("js-code");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  let generatedWebsite = null;

  // Tab switching
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      tabPanes.forEach((pane) => pane.classList.remove("active"));
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Add auto-resize for textarea
  promptInput.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
  });
  
  // Character count is now handled in the HTML with the new UI
  
  // Character count is now handled directly in the HTML with the new UI
  
  // Generate website
  // Define maximum characters allowed
  const maxChars = 1000;
  
  generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      showToast("Please enter a website description", "error");
      return;
    }
    
    if (prompt.length > maxChars) {
      showToast(`Description is too long (max ${maxChars} characters)`, "error");
      return;
    }

    loaderContainer.style.display = "flex";
    loadingText.innerHTML = "<i class='fas fa-robot'></i> AI is crafting your website...";
    generateBtn.disabled = true;
    
    // Scroll to loader
    loaderContainer.scrollIntoView({ behavior: "smooth" });

    let response = null;

    try {
      // Use absolute URL for API endpoint to ensure it works in development
      response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate website");
      }

      const data = await response.json();

      if (!data.html || !data.css || !data.js) {
        throw new Error("Incomplete website data received");
      }

      // ✅ Clear the prompt
      promptInput.value = "";

      // Store generated code
      generatedWebsite = data;
      htmlCode.textContent = data.html;
      cssCode.textContent = data.css;
      jsCode.textContent = data.js;

      // Render preview
      const previewDoc =
        previewFrame.contentDocument || previewFrame.contentWindow.document;
      previewDoc.open();
      previewDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${data.css}</style>
        </head>
        <body>
          ${data.html}
          <script>${data.js}<\/script>
        </body>
        </html>
      `);
      previewDoc.close();

      outputSection.style.display = "block";
      openInTabBtn.disabled = false;
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "Failed to generate website. Please try again.";
      try {
        const errData = await response.json();
        if (errData.error) {
          errorMessage = `Error: ${errData.error}\n${errData.details || ""}`;
        }
      } catch (_) {
        // If error body isn't JSON
      }
      showToast(errorMessage, "error");
    } finally {
      loaderContainer.style.display = "none";
      loadingText.textContent = "";
      generateBtn.disabled = false;
    }
    
    // Scroll to output section if successful
    if (outputSection.style.display === "block") {
      outputSection.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Copy buttons
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const codeElement = document.getElementById(targetId);
      const codeText = codeElement.textContent;

      navigator.clipboard
        .writeText(codeText)
        .then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = "<i class='fas fa-check'></i> Copied!";
          showToast("Code copied to clipboard!", "success");
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
        });
    });
  });

  // Reset button
  resetBtn.addEventListener("click", () => {
    promptInput.value = "";
    outputSection.style.display = "none";
    generatedWebsite = null;
    promptInput.focus();
  });

  // Open in new tab
  openInTabBtn.addEventListener("click", () => {
    if (!generatedWebsite) return;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Generated Website</title>
          <style>${generatedWebsite.css}</style>
        </head>
        <body>
          ${generatedWebsite.html}
          <script>${generatedWebsite.js}<\/script>
        </body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    showToast("Website opened in new tab", "success");
  });
  
  // Toast notification system
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "info-circle";
    if (type === "success") icon = "check-circle";
    if (type === "error") icon = "exclamation-circle";
    
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add("show"), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  
  // Example prompts are now handled with suggestion chips in the HTML
  
  // Toast notification system
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  function showToast(message, type = "info") {
    toastMessage.textContent = message;
    toast.className = `toast toast-${type} show`;
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
});