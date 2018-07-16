package util;

import org.apache.commons.collections.CollectionUtils;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.util.List;
import java.util.Properties;

public class Mail {

    private MimeMessage mimeMsg; // MIME邮件对象
    private Session session; // 邮件会话对象
    private Properties props; // 系统属性
    // smtp认证用户名和密码
    private String username;
    private String password;
    private Multipart mp; // Multipart对象,邮件内容,标题,附件等内容均添加到其中后再生成MimeMessage对象

    /**
     * Constructor
     *
     * @param smtp 邮件发送服务器
     */
    public Mail(String smtp) {
        setSmtpHost(smtp);
        createMimeMessage();
    }

    /**
     * 调用sendOut方法完成邮件发送
     *
     * @param smtp
     * @param from
     * @param to
     * @param subject
     * @param content
     * @param username
     * @param password
     * @return boolean
     */
    public static boolean send(String smtp, String from, List<String> to, String subject, String content,
                               String username, String password) {
        Mail theMail = new Mail(smtp);
        theMail.setNeedAuth(true); // 需要验证
        if (!theMail.setSubject(subject))
            return false;
        if (!theMail.setBody(content))
            return false;
        if (!theMail.setTos(to))
            return false;
        if (!theMail.setFrom(from))
            return false;
        theMail.setNamePass(username, password);
        if (!theMail.sendOut())
            return false;
        return true;
    }

    /**
     * 调用sendOut方法完成邮件发送,带抄送
     *
     * @param smtp
     * @param from
     * @param to
     * @param copyto
     * @param subject
     * @param content
     * @param username
     * @param password
     * @return boolean
     */
    public static boolean sendAndCc(String smtp, String from, List<String> to, List<String> copyto, String subject,
                                    String content, String username, String password) {
        Mail theMail = new Mail(smtp);
        theMail.setNeedAuth(true); // 需要验证

        if (!theMail.setSubject(subject))
            return false;
        if (!theMail.setBody(content))
            return false;
        if (!theMail.setTos(to))
            return false;
        if (!theMail.setCopyTos(copyto))
            return false;
        if (!theMail.setFrom(from))
            return false;
        theMail.setNamePass(username, password);
        if (!theMail.sendOut())
            return false;
        return true;
    }

    /**
     * 调用sendOut方法完成邮件发送,带附件
     *
     * @param smtp
     * @param from
     * @param to
     * @param subject
     * @param content
     * @param username
     * @param password
     * @param filename 附件路径
     * @return
     */
    public static boolean send(String smtp, String from, String to, String subject, String content, String username,
                               String password, String filename) {
        Mail theMail = new Mail(smtp);
        theMail.setNeedAuth(true); // 需要验证

        if (!theMail.setSubject(subject))
            return false;
        if (!theMail.setBody(content))
            return false;
        if (!theMail.setTo(to))
            return false;
        if (!theMail.setFrom(from))
            return false;
        theMail.setNamePass(username, password);
        if (!theMail.sendOut())
            return false;
        return true;
    }

    /**
     * 调用sendOut方法完成邮件发送,带附件和抄送
     *
     * @param smtp
     * @param from
     * @param to
     * @param copyto
     * @param subject
     * @param content
     * @param username
     * @param password
     * @param filename
     * @return
     */
    public static boolean sendAndCc(String smtp, String from, String to, String copyto, String subject, String content,
                                    String username, String password, String filename) {
        Mail theMail = new Mail(smtp);
        theMail.setNeedAuth(true); // 需要验证

        if (!theMail.setSubject(subject))
            return false;
        if (!theMail.setBody(content))
            return false;
        if (!theMail.setTo(to))
            return false;
        if (!theMail.setCopyTo(copyto))
            return false;
        if (!theMail.setFrom(from))
            return false;
        theMail.setNamePass(username, password);
        if (!theMail.sendOut())
            return false;
        return true;
    }

    /**
     * 设置邮件发送服务器
     *
     * @param hostName String
     */
    public void setSmtpHost(String hostName) {
        //System.out.println("设置系统属性：mail.smtp.host = " + hostName);
        if (props == null)
            props = System.getProperties(); // 获得系统属性对象
        props.put("mail.smtp.host", hostName); // 设置SMTP主机
        props.put("mail.smtp.auth", "true");
    }

    /**
     * 创建MIME邮件对象
     *
     * @return
     */
    public boolean createMimeMessage() {
        try {
            //System.out.println("准备获取邮件会话对象！");
            session = Session.getDefaultInstance(props, null); // 获得邮件会话对象
        } catch (Exception e) {
            System.err.println("获取邮件会话对象时发生错误！" + e);
            return false;
        }

        //System.out.println("准备创建MIME邮件对象！");
        try {
            mimeMsg = new MimeMessage(session); // 创建MIME邮件对象
            mp = new MimeMultipart();
            return true;
        } catch (Exception e) {
            System.err.println("创建MIME邮件对象失败！" + e);
            return false;
        }
    }

    /**
     * 设置SMTP是否需要验证
     *
     * @param need
     */
    public void setNeedAuth(boolean need) {
        //System.out.println("设置smtp身份认证：mail.smtp.auth = " + need);
        if (need) {
            props.put("mail.smtp.auth", "true");
        } else {
            props.put("mail.smtp.auth", "false");
        }
    }

    /**
     * 设置用户名和密码
     *
     * @param name
     * @param pass
     */
    public void setNamePass(String name, String pass) {
        username = name;
        password = pass;
    }

    /**
     * 设置邮件主题
     *
     * @param mailSubject
     * @return
     */
    public boolean setSubject(String mailSubject) {
        //System.out.println("设置邮件主题！-----" + mailSubject);
        try {
            mimeMsg.setSubject(mailSubject);
            return true;
        } catch (Exception e) {
            System.err.println("设置邮件主题发生错误！");
            return false;
        }
    }

    /**
     * 设置邮件正文
     *
     * @param mailBody String
     */
    public boolean setBody(String mailBody) {
        //System.out.println("设置邮件正文！-----" + mailBody);
        try {
            BodyPart bp = new MimeBodyPart();
            bp.setContent("" + mailBody, "text/html;charset=utf-8");
            mp.addBodyPart(bp);

            return true;
        } catch (Exception e) {
            System.err.println("设置邮件正文时发生错误！" + e);
            return false;
        }
    }

    /**
     * 添加附件
     *
     * @param filename String
     */
    public boolean addFileAffix(String filename) {

        //System.out.println("增加邮件附件：" + filename);
        try {
            // BodyPart bp = new MimeBodyPart();
            // FileDataSource fileds = new FileDataSource(filename);
            // bp.setDataHandler(new DataHandler(fileds));
            // bp.setFileName(fileds.getName());
            //
            // mp.addBodyPart(bp);

            return true;
        } catch (Exception e) {
            System.err.println("增加邮件附件：" + filename + "发生错误！" + e);
            return false;
        }
    }

    /**
     * 设置发信人
     *
     * @param from String
     */
    public boolean setFrom(String from) {
        //System.out.println("设置发信人！");
        try {
            mimeMsg.setFrom(new InternetAddress(from, "自动化测试平台")); // 设置发信人
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 设置收信人
     *
     * @param to String
     */
    public boolean setTo(String to) {
        if (to == null)
            return false;
        try {
            mimeMsg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 群发
     *
     * @param to String
     */

    public boolean setTos(List<String> to) {
        if (CollectionUtils.isEmpty(to))
            return false;
        try {
            InternetAddress[] address = new InternetAddress[to.size()];
            for (int i = 0; i < to.size(); i++) {
                address[i] = new InternetAddress(to.get(i));
            }
            mimeMsg.setRecipients(Message.RecipientType.TO, address);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 设置抄送人
     *
     * @param copyto String
     */
    public boolean setCopyTo(String copyto) {
        if (copyto == null)
            return false;
        try {
            mimeMsg.setRecipients(Message.RecipientType.CC, (Address[]) InternetAddress.parse(copyto));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 设置抄送人
     *
     * @param copyto String
     */
    public boolean setCopyTos(List<String> copyto) {
        if (CollectionUtils.isEmpty(copyto)) {
            return false;
        }
        try {
            InternetAddress[] address = new InternetAddress[copyto.size()];
            for (int i = 0; i < copyto.size(); i++) {
                address[i] = new InternetAddress(copyto.get(i));
            }
            mimeMsg.setRecipients(Message.RecipientType.CC, address);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    /**
     * 发送邮件
     */
    public boolean sendOut() {
        try {
            mimeMsg.setContent(mp);
            mimeMsg.saveChanges();
            //System.out.println("正在给发送邮件....");

            Session mailSession = Session.getDefaultInstance(props, null);
            Transport transport = mailSession.getTransport("smtp");
            transport.connect((String) props.get("mail.smtp.host"), username, password);
            if (null != mimeMsg.getRecipients(Message.RecipientType.TO)) {
                transport.sendMessage(mimeMsg, mimeMsg.getRecipients(Message.RecipientType.TO));
            }
            if (null != mimeMsg.getRecipients(Message.RecipientType.CC)) {
                transport.sendMessage(mimeMsg, mimeMsg.getRecipients(Message.RecipientType.CC));
            }
            //transport.send(mimeMsg);

            transport.close();

            return true;
        } catch (Exception e) {
            System.err.println("邮件发送失败！" + e);
            return false;
        }
    }

}